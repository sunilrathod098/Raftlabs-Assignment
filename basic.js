function claimbStairs(n) {
    if (n <= 1){
        return 1;
    }
    let a = 1, b= 2;

    for (let i = 2; i <= n; i++){
        let c = a+b;
        a =b;
        b=c;
    }
    return b;
}

console.log(claimbStairs(2));
console.log(claimbStairs(3));
console.log(claimbStairs(4))