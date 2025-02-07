//Have to connect to model here

const getAllPOCs = async (req, res) => {
    try{

        res.status(200).send('Fetched all POCs from Bank');
    }catch(err){
        res.status(400).json({error: error.message});
    }
}

module.exports = {
    getAllPOCs,
}