import { connect } from 'mongoose';

async function connectToDatabase() {
    try {
        await connect('mongodb://localhost:27017/fpt-quiz');
        console.log('Connected');
    } catch (err) {
        console.log('Connect failed');
    }
}

export default { connectToDatabase };
