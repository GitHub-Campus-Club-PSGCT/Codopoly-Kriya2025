//Have to connect to model here

const getTeamPOC = async (req, res) => {
    try{

        res.status(200).send('Fetched Team POCs');   
    }catch(error){
        res.status(400).json({error: error.message});
    }
}

const submitDebugs = async (req, res) => {
    try{

        res.status(200).send('Submitted Debugs');   
    }catch(error){
        res.status(400).json({error: error.message});
    }
}

module.exports = {
    getTeamPOC,
    submitDebugs,
}