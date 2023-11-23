
const express = require('express')
const app = express()
const port = 5001
const fs = require('fs')
const path = require('path');
const router = express.Router()
const router2 = express.Router()


//SQL configs
const mysql = require('mysql');
require('dotenv').config();

const connection = mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_DATABASE
});

connection.connect();

const xss = require("xss");

app.get('/api', (req,res) => {
    res.json({"users":["user1","user2","user3"]})
})

let hero_info;
let hero_powers;

//installing router at api/hero
app.use('/', express.static('client'));

app.use('/api/hero', router);
app.use('/api/users',router2)

app.use(express.json());
router.use(express.json());
router2.use(express.json())


//to automatically log the client requests
app.get('/api', (req,res)=>{
    res.json({"users":["user1","user2","user3"]})
})

app.use((req,res,next) => {
    console.log(`${req.method} request for ${req.url}`)
    next();
});

//default sends all info data
router.get('/', (req, res) => {
    if (hero_info) {
        res.json(hero_info); 
    } else {
        res.status(500).send('JSON data for info is not available');
    }
});


router2.get("/users_list", (req,res) => {

    const sql = 'SELECT * FROM Users';

    try {
        connection.query(sql, (error, results) => {
            
            if (error) {
                res.status(501).json({ error: 'An SQL error occurred' });
            } else {
                if (results.length > 0) {
                    res.status(200).json({ users: results });
                } else {
                    res.status(404).json({ message: 'No users found' });
                }
            }
        })

    } catch (error) {
            res.status(500).json({ error: 'An server side error occurred ' });
    }
})



router2.get("/get_user/:email/:password", (req,res)=>{
    const userEmail = sanitize(req.params.email.trim());
    const userPass = sanitize(req.params.password.trim());

    const sql = 'SELECT * FROM Users WHERE email = ? AND password = ?';
    const values = [userEmail,userPass];

    try {
        connection.query(sql, values, (error, results) => {
            if (error){
                res.status(501).json({ error: 'An sql error occurred' });
            }else{
                if (results.length > 0){
                    res.status(200).json({user: results[0]})
                }else{
                    res.status(404).json({message: "Invalid Credentials"})
                }
                //res.status(200).json({message: 'User added successfully',userID: results.insertId, status: 200})
            }
        })

    } catch (error) {
            res.status(500).json({ error: 'An server side error occurred ' });
    }
})


router2.get("/disable-user/:id/:status", (req,res) => {
    
    let disabled = sanitize(req.params.status.trim())
    let userid = sanitize(req.params.id.trim())

    const sql = 'UPDATE Users SET disabled = ? WHERE id = ?';
    const values = [disabled,userid];
    
    try {
        connection.query(sql, values, (error, results) => {
            if (error){
                res.status(501).json({ error: 'An sql error occurred' });

            }else{
                if (results.length > 0){
                    res.status(200).json({results: results})
                }else{
                    res.status(404).json({message: "Unable to update"})
                }
            }
        })

    } catch (error) {
            res.status(500).json({ error: 'An server side error occurred ' });
    }
})


router2.get("/admin-user/:id/:status", (req,res) => {

    let userid = sanitize(req.params.id.trim());
    let admin = sanitize(req.params.status.trim());

    const sql = 'UPDATE Users SET admin = ? WHERE userID = ?';
    const values = [admin, userid];

    connection.query(sql, values, (error, results) => {
        if (error) {
            console.error('SQL error:', error.message);
            res.status(500).json({ error: 'A server-side error occurred' });
        } else {
            if (results.affectedRows > 0) {
                res.status(200).json({ message: "Update successful" });
            } else {
                res.status(404).json({ message: "No user found for the provided ID" });
            }
        }
    });

})




router2.post("/add-user", (req,res) => {
    const newUser = req.body;

    const sql = 'INSERT INTO Users(nName,email,password) VALUES (?,?,?)';
    const values = [newUser.nName,newUser.email, newUser.password];
    try {
        connection.query(sql, values, (error, results) => {
            if (error){
                if(error.errno === 1062){
                    res.status(409).json({ error: 'User already exists' });
                }
            }else{
                res.status(200).json({message: 'User addedd successfully',userID: results.insertId, status: 200})
            }
        })

    } catch (error) {
            res.status(500).json({ error: 'An error occurred while appending data to the file' });
        }
})


router.post('/deleteList',(req,res) => {

    try {

        // Getting existing data
        const jsonData = fs.readFileSync("data/superhero_lists.json", 'utf8');
        const jsonArray = JSON.parse(jsonData);
        let exists = false;
    
        let newData = req.body;
        
        console.log(newData)
    
        for (const list of jsonArray) {
          if (list.name.toLowerCase() == newData.name.toLowerCase()) {
            exists = true;
            break; 
          }
        }
        if (!exists) {
          res.status(409).json({ error: 'List does not exist' });
        } else {

            let newArray = jsonArray.filter((list) => list.name !== newData.name);
            const updatedData = JSON.stringify(newArray, null, 2);
            fs.writeFileSync("data/superhero_lists.json", updatedData);
            console.log('Data deleted from the JSON file.');
            res.json({ message: 'Data deleted successfully'});
        }
      } catch (error) {
        console.error('Error appending data to the JSON file:', error);
        res.status(500).json({ error: 'An error occurred while appending data to the file' });
      }
})



router.post('/newList', (req, res) => {
    const newList = req.body;

    let heroIDs = JSON.stringify(newList.heroIDs)

    const sql = 'INSERT INTO Hero_Lists(UserID, ListName, HeroIDs) VALUES (?,?,?)';
    
    const values = [newList.userID, newList.listName, heroIDs];

    try {
        
        connection.query(sql, values, (error, results) => {
            if (error){
                if(error.errno === 1062){
                    res.status(409).json({ error: 'List named ' + newList.listName + " already exists."});
                }
            }else{
                res.status(200).json({message: 'List Added successfully', status: 200})
            }
        })

    } catch (error) {
            res.status(500).json({ error: 'An error occurred while appending data to the file' });
        }
  });


router.post('/newList', (req, res) => {
    try {
      // Getting existing data
      const jsonData = fs.readFileSync("data/superhero_lists.json", 'utf8');
      const jsonArray = JSON.parse(jsonData);
      let exists = false;
  
      const newData = req.body;
      console.log(newData)
  
      for (const list of jsonArray) {
        if (list.name === newData.name) {
          exists = true;
          break; 
        }
      }
  
      if (exists) {
        res.status(409).json({ error: 'List name already exists' });
      } else {
    
        jsonArray.push(newData);
        const updatedData = JSON.stringify(jsonArray, null, 2);
        fs.writeFileSync("data/superhero_lists.json", updatedData);
        console.log('Data appended to the JSON file.');
        res.json({ message: 'Data appended successfully' });
      }
    } catch (error) {
      console.error('Error appending data to the JSON file:', error);
      res.status(500).json({ error: 'An error occurred while appending data to the file' });
    }
  });
  

  

//detects html and javascript potentially dangerous
function sanitize(input) {
    const sanitizedInput = xss(input);
    return sanitizedInput;
}



router.get('/past_lists', (req, res) => {
    
    let hero_lists = []

    fs.readFile('data/superhero_lists.json', 'utf8', (err, data) => {
        if (err) {
            console.error(err);
            res.status(500).send('Internal Server Error');
        } else {
            let lists = JSON.parse(data);
            for (list of lists){
                hero_lists.push(list)
            }
            res.json(hero_lists); 
        }
    })
});

router.get('/powers', (req,res) => {
    if (hero_powers) {
        res.json(hero_powers); 
    } else {
        res.status(500).send('JSON data for powers is not available');
    }
});


router.get(`/search/:property/:property_value/:sortBy`, (req,res) => {
    let property = req.params.property
    let property_value = req.params.property_value
    let sortBy = req.params.sortBy

    //input sanitzation
    property = sanitize(property.trim())
    sortBy = sanitize(sortBy.trim())
    property_value = sanitize(property_value.trim())
    

    let results = hero_info;
    let truePowers = []

    for (hero of hero_powers){
        let pows = []
        for(prop in hero){
            if (hero[prop] == "True"){
                pows.push(prop)
            }
        }
        let obj = {}
        obj.name = hero["hero_names"]
        obj.powers = pows
        truePowers.push(obj)
    }

    if (String(property).toLowerCase() === "power"){
        truePowers = truePowers.filter(hero => (hero.powers).map(power=>power.toLowerCase()).includes(property_value.toLowerCase()))
    }else{
        results = hero_info.filter(hero => String(hero[property]).toLowerCase() === property_value.toLowerCase())
    }

    for (hero of results){
        let h_powers = truePowers.find(h=> h["name"] == hero["name"])
        if (h_powers && h_powers.powers){
            hero.powers = h_powers.powers;
        }
    }

    if (sortBy.toLowerCase() === "power") {
        results.sort((a, b) => {
          const l_a = Array.isArray(a.powers) ? a.powers.length : 0;
          const l_b = Array.isArray(b.powers) ? b.powers.length : 0;
          return l_b - l_a; //descending
        });
      } else if (sortBy.toLowerCase() !== "none") {
        results.sort((a, b) => a[sortBy].localeCompare(b[sortBy]));
    }
    if (results) {
        res.json(results); 
    } else {
        res.status(500).send(`JSON data for ${property} = ${property_value} is not available`);
    }
});



router.get('/publishers', (req,res) => {
    //retreiving only publishers, making sure theres unique entries
    pubs = Array.from(new Set(hero_info.map(hero => hero["Publisher"] )));
    //removing empty publisher entries
    const unique_pubs = pubs.filter(pub => pub !== '')

    if (unique_pubs) {
        res.json(unique_pubs); 
    } else {
        res.status(500).send('JSON data is not available');
    }
})

//getting for a specific hero ID
router.get('/:hero_id', (req,res) => {
    let id = req.params.hero_id
    id = sanitize(id.trim())

    const hero = hero_info.find(p => p.id === parseInt(id))

    if (hero) { 
        res.send(hero); 
    } else {
        res.status(404).send(`Hero ${id} not found`);
    }
});

router.get('/:hero_id/powers', (req,res) => {
    let id = req.params.hero_id
    id = sanitize(id.trim())
    const hero = hero_info.find(p => p.id === parseInt(id))
    const powers = hero_powers.find(p => p.hero_names == hero.name)
    let power_arr = [];

    if(powers !== null && typeof powers !== 'undefined'){
        power_arr = Object.entries(powers)
        power_arr = power_arr.filter(([key, value]) => value == "True").map(([key,value]) => key)
    }
    if (power_arr){
        res.json(power_arr); 
    } else {
        res.status(500).send('JSON data is not available');
    }
});


//returns IDs
router.get('/:field/:pattern/:n', (req,res) => {

    let field = req.params.field
    field = sanitize(field.trim())
    let pattern = req.params.pattern
    pattern = sanitize(pattern.trim())
    let n = req.params.n
    n = sanitize(n.trim())

    matches = hero_info.filter(h => (h[field] == pattern)).slice(0,parseInt(n))
    
    if (matches){
        res.json(matches); 
    } else {
        res.status(500).send('JSON data is not available');
    }
})



//get all available patterns for a specified field

router.get('/search/:field', (req,res) => {
    let field = req.params.field
    field = sanitize(field.trim())

    patterns = Array.from(new Set(hero_info.map(h => h[field])))

    if (patterns){
        res.json(patterns); 
    } else {
        res.status(500).send('JSON data is not available');
    }
})


app.listen(port, () => {

    console.log(`Listening on port ${port}`);

    fs.readFile('superheroes/superhero_info.json', 'utf8', (err, data) => {
        if (err) {
            //console.error(err);
            res.status(500).send('Internal Server Error');
        } else {
            hero_info = JSON.parse(data);
            fs.readFile('superheroes/superhero_powers.json', 'utf8', (err, data) => {
                if (err) {
                    console.error(err);
                    res.status(500).send('Internal Server Error');
                } else {
                    hero_powers = JSON.parse(data);
                    let newPowers = hero_powers.map(function(hero){
                        for(const power in hero){
                            if (power!== "hero_names" && hero[power]!=="True"){
                                delete hero[power];
                            }
                        }
                        return hero;
                    })

                    //combining powers and hero info
                    for (hero of hero_info){
                        let powers = newPowers.find((e)=>e.hero_names == hero.name)
                        let curr_powers = []
                        for (let power in powers){
                            if(power !== "hero_names"){
                                curr_powers.push(power);
                            }
                        }
                        hero.powers = curr_powers;
                    }
                }
            })
        }
    })
}); 

