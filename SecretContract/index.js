"use strict";

var Compact = function (array) {
        if (array == null) return []
        let resIndex = 0 
        const result = [] 
        for (const value of array) {
            //遍历原数组，当value存在时，将value插入新数组
            if (value) {
                result[resIndex++] = value
            }
        }
        //返回新数组
        return result
    }


var SecretItem = function (secret) {
    if (secret) {
        var obj = JSON.parse(secret);
        this.key = obj.key;
        this.value = obj.value;
        this.author = obj.author;
    } else {
        this.key = "";
        this.author = "";
        this.value = "";
    }
};

SecretItem.prototype = {
    toString: function () {
        return JSON.stringify(this);
    }
};

var SecretObj = function () {
    LocalContractStorage.defineMapProperty(this, "secret", {
        parse: function (text) {
            return new SecretItem(text);
        },
        stringify: function (o) {
            return o.toString();
        }
    });
};

SecretObj.prototype = {
    init: function () {
        // todo
    },

    save: function (key, value) {
        key = key.trim();
        value = value.trim();
        if (key === "" || value === "") {
            throw new Error("empty key / value");
        }


        var from = Blockchain.transaction.from;
        var secretItem = this.secret.get(key);
        if (secretItem) {
            throw new Error("value has been occupied");
        }

        secretItem = new SecretItem();
        secretItem.author = from;
        secretItem.key = key;
        secretItem.value = value;

        this.secret.put(key, secretItem);
    },

    get: function (key) {
        key = key.trim();
        if (key === "") {
            throw new Error("empty key")
        }
        return this.secret.get(key);
    }
};
module.exports = SecretObj;