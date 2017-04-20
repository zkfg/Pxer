const Path =require('path');
const Fs =require('fs');
const Babel = require('babel-core');

module.exports.pxerURL ='https://pxer-app.pea3nut.org/';
module.exports.rootPath ='../';
module.exports.pxerVersion ='7.0.4';

module.exports.path2URL =function(path){
    var url =module.exports.pxerURL;
    var target =Path.resolve(path);
    var root =Path.resolve(module.exports.rootPath);
    return target
        .replace(root ,'')
        .replace(/\\/g,'/')
        .replace(/^\//,'')
    ;
};
module.exports.getAllFile =function(path){

    var stack =Fs.readdirSync(path);
    var fileList =[];

    var fileName =null;
    while(fileName =stack.shift()){
        if(Fs.statSync(Path.join(path,fileName)).isDirectory()){
            stack.push(...Fs.readdirSync(path+fileName).map(item=>Path.join(fileName,item)))
        }else{
            fileList.push(Path.join(path,fileName));
        };
    }

    return fileList;

};
module.exports.automaticDoc=function(path){
    const Path =require('path');
    return `\
/**
 * Automatic generated by "${Path.basename(path)}"
 * */
`;

};
module.exports.groupFile =function(array){
    // 由于Array#sort不稳定，这里手动使用冒泡排序
    for(let i=0 ;i<array.length ;i++){
        for(let j=1 ;j<array.length-i ;j++){
            if(getNum(array[j-1])>getNum(array[j])){
                let tmp =array[j-1];
                array[j-1] =array[j];
                array[j] =tmp;
            }
        };
    };
    // 按相同数字分组
    let newArray =[[array[0]]];
    for(let item of array.slice(1)){
        if(getNum(item)===getNum(newArray[newArray.length-1][0])){
            newArray[newArray.length-1].push(item);
        }else{
            newArray.push([item]);
        }
    };
    return newArray;

    function getNum(str){
        let reg =/^.+\.(\-?\d+(\.\d+)?)\..*?$/;
        var res =str.match(reg);
        if(res) return res[1];
        else return 0;
    };
};
module.exports.reader =function(tpl,data){
    const Ejs =require('ejs');Ejs.delimiter ='?';
    // 格式化数据
    var tplData ={};
    for(let key in data){
        if(typeof data[key] ==='boolean'){
            tplData[key] =data[key];
        }else{
            tplData[key] ='*/' +JSON.stringify(data[key] ,null ,'    ') +';//';
        }
    }
    // 渲染
    return Ejs.render(tpl,tplData);
};

module.exports.babelCopy =function(origin,target){
    Fs.writeFileSync(
        target,
        Babel.transformFileSync(origin ,{
            presets: [
                "es2015",
                "stage-2"
            ]
        }).code
    );
};
module.exports.babelTransform =function(string){
    if(Buffer.isBuffer(string)) string =string.toString();
    return Babel.transform(string ,{
        presets: [
            "es2015",
            "stage-2"
        ]
    }).code;
};