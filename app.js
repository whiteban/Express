(async() =>{
const bcrypt = require('bcryptjs');
try {
    let mdp="123456";
    let hash = await bcrypt.hash(mdp, await bcrypt.genSalt(10));
    let hash2 = await bcrypt.hash(mdp, await bcrypt.genSalt(10));
    console.log(hash)
    console.log(hash2)
    let compare = await bcrypt.compare(mdp, hash);
    let compare2 = await bcrypt.compare(mdp, hash);
    console.log(compare)
    console.log(compare2)
} catch (error) {
   console.log(error.message) 
}
})()

const bcrypt = require('bcrypt');
