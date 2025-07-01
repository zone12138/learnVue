Promise.resolve(1).catch().catch().then(console.log)
Promise.reject("2").catch().catch(console.log).then()