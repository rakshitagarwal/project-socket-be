const calculatePrivilages = (previlageNum) => {
    if(previlageNum > 0){
        const myPrevillages = [];
        const sumToOp = [
            'GET',
            'POST',
            'PUT | PATCH',
            'DELETE'
        ];
        for(let i = (sumToOp.length-1); 0 <= i; i--){
            if(previlageNum >= (2 ** i)) {
            myPrevillages.push(sumToOp[i]);
            previlageNum = previlageNum - (2**i);
            }
        }
        return myPrevillages;
    }
}