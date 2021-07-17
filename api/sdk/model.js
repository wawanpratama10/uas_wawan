const tf = require('@tensorflow/tfjs-node');

function normalized(data){ // x1, x2, x3
    x1 = (data[0] - 42.773) / 10.33017006
    x2 = (data[1] - 29.9412) / 8.936247191
    x3 = (data[2] - 94.8964) / 8.887376673
    return [x1, x2, x3]
}

function denormalized(data){ // y1, y2, y3
    y1 = (data[0] * 16.08197907) + 32.2718
    y2 = (data[1] * 8.918185118) + 39.959
    y3 = (data[2] * 11.79955613) + 69.739
    return [y1, y2, y3]
}


async function predict(data){
    let in_dim = 3;
    
    data = normalized(data);
    shape = [1, in_dim];

    tf_data = tf.tensor2d(data, shape);

    try{
        // path load in public access => github
        const path = 'https://raw.githubusercontent.com/wawanpratama10/uas_wawan/main/public/cls_model/model.json';
        const model = await tf.loadGraphModel(path);
        
        predict = model.predict(
                tf_data
        );
        result = predict.dataSync();
        return denormalized( result );
        
    }catch(e){
      console.log(e);
    }
}

module.exports = {
    predict: predict 
}
