const matrix = [[0, 1, 2, 0], [3, 4, 5, 2], [1, 3, 1, 5]]

// function setMatrixZero(array) {
//   return array
//     .map(row =>
//       row.some((item) => item === 0) ? row.fill(0) : row
//       )
//     .reduce((acc, row, idx) => {
//       if (idx > 0) {
//         const prevRow = acc[idx - 1]
//         console.log('prevRow', prevRow);
//         const updatedRow = row.map((item, idx) => {
//           console.log('item', item, 'prevRow[idx]', prevRow[idx]);

//           prevRow[idx] === 0 ? 0 : item
//         })

//         return [...acc, updatedRow]
//       }

//       return [...acc, row]
//     }, [])
// }


// function setMatrixZero(array) {
//   for (let rowIndex = 0; rowIndex < array.length; rowIndex++) {

//   }
// }

// console.log(setMatrixZero(matrix))

// const a = [1,2,3]

// function t(array) {

//   array[1] = 'werwer'
// }

// t(a)

// console.log(a);


// function bind2(context, ...args) {
//   // console.log(this);
//   return function(...args) {
//     this.apply(...args)
//   }
// }

// Function.prototype.bind2 = bind2

// const sum = (x, y) => x+y
// const plusTen = sum.bind2(undefined, 10)
// console.log(plusTen);

// console.log(plusTen(20));
// const plusTen = sum.bind2

function sum(...args) {
  if (args.length > 1) {
    return args.reduce((acc, curr) => acc + curr, 0)
  }

  return function(b) {
    return args[0] + b
  }
}

console.log(sum(1, 5, 6, 7));
console.log(sum(1)(7));


Function.prototype.bind2 = function(context, ...args) {
  return (...args2) => {
    return this.apply(context, [...args, ...args2])
  }
}

const plusTen = sum.bind2(undefined, 10)
console.log(plusTen(20));