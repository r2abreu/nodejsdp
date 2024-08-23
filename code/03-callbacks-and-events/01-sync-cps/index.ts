function addCps(x: number, y: number, callback: (t: number) => void) {
    callback(x + y);
}

console.log("Before");
addCps(1, 2, (sum) => console.log(sum))
console.log("After");