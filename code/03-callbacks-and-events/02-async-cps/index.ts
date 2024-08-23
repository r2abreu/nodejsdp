function additionAsync(
  x: number,
  y: number,
  callback: (t: number) => void,
): void {
  setTimeout(() => callback(x + y), 0);
}

console.log("Before");
additionAsync(1, 2, (sum) => console.log(sum));
console.log("After");
