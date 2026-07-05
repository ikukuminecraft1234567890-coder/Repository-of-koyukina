function cb(fn) {
for (let i = 0;i<5;i++) {
const a = 2 ** i
fn(i,a)
}}
cb(function(i,v){console.log(i,v)})