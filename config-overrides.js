
const path = require("path");
const {override, addWebpackAlias, addWebpackExternals, addWebpackPlugin, addWebpackResolve} = require("customize-cra");
const HtmlWebpackExternalsPlugin = require('html-webpack-externals-plugin')



const targetServer = process.env.REACT_APP_MODE;

console.log("targetServer", targetServer);
if(!targetServer|| targetServer === 'dev' || targetServer === 'local'){
    process.env.NODE_ENV = 'development'
}else if(targetServer === 'stg') {
    process.env.NODE_ENV = 'stage'
}else{
    process.env.NODE_ENV = 'production'
}

Date.prototype.yyyyMMddhhmmss = function(){
    const MM = this.getMonth() + 1;
    const dd = this.getDate();
    const hh = this.getHours();
    const mm = this.getMinutes();
    const ss = this.getSeconds();
    return [
        this.getFullYear(),
        (MM>9 ? '' : '0') + MM,
        (dd>9 ? '' : '0') + dd,
        (hh>9 ? '' : '0') + hh,
        (mm>9 ? '' : '0') + mm,
        (ss>9 ? '' : '0') + ss,
    ].join('');
}

const BUILD_TIME = new Date().yyyyMMddhhmmss();

process.env.REACT_APP_BUILD_TIME = BUILD_TIME;
process.env.REACT_APP_ORG_IMG_PATH = `https://res.cloudinary.com/finnq/image/upload/q_auto,f_auto/v${BUILD_TIME}/p/assets/institution/`;
// process.env.REACT_APP_ORG_IMG_PATH = `https://res.cloudinary.com/finnq/image/upload/p/assets/institution/`;

// new HtmlWebpackExternalsPlugin({
//     externals: [
//         {
//             module: 'ui',
//             entry: {
//                 path: 'https://dpop.finnq.com/ui_common/css/ui.css?v=',
//                 type: 'css'
//             }
//         },
//
//     ],
// }),
module.exports = override(
    addWebpackAlias({
      '@':path.resolve(__dirname,'src'),
    }),

    config => {
        config.plugins = ( config.plugins || []).concat([

        ]);
        return config;
    }
);
