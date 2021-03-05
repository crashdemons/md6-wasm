if(typeof createMd6Module === 'undefined'){
    createMd6Module = Promise.reject(new Error('md6 wasm module was not available'));
}

var md6 = {
    
    internal: {
        module: null,
        bytesFromBuffer: function(internalBuffer,bufLen){
            const resultView = new Uint8Array(this.module.HEAP8.buffer, internalBuffer, bufLen);//view, not a copy
            const result = new Uint8Array(resultView);//copy, not a view!
            return result;
        },

        bufferFromBytes: function(bytes){
            var internalBuffer = this.create_buffer(bytes.length);
            this.applyBytesToBuffer(bytes, internalBuffer);
            return internalBuffer;
        },
        applyBytesToBuffer : function(bytes, internalBuffer){
            this.module.HEAP8.set(bytes, internalBuffer);
        },
        toHex: function(bytes){
            return Array.prototype.map.call(bytes, function (n) {
                return (n < 16 ? '0' : '') + n.toString(16)
              }).join('');
        },
        inputToBytes: function (input) {
            if (input instanceof Uint8Array) {
                return input;
            } else if (typeof (input) === 'string') {
                return (new TextEncoder()).encode(input);
            } else {
                throw new Error('Input must be an string, Buffer or Uint8Array')
            }
        }
    },


    /**
     * Checks if Md6 support is ready (WASM Module loaded)
     * @return {Boolean}
     */
    isReady : function(){
        return this.internal.module!==null;
        
    },
    
    /**
     * Initializes a Hashing Context for Md6
     * @param {Number} digest_size the number of bits for the digest size (512 or 256). 512 is default.
     * @return {Object} the context object for this hashing session. should only be used to hash one data source.
     */
    init: function(digest_size_bits){
        let digest_size_bytes = digest_size_bits/8;
        return {
            digest_size_bits : digest_size_bits,
            digest_size_bytes : digest_size_bytes,
            context: this.internal.init(digest_size_bits) // param d: "hash bit length" (md6.h)
        };
    },
    
    /**
     * Update the hashing context with new input data
     * @param {Object} contextObject the context object for this hashing session
     * @param {Uint8Array} bytes an array of bytes to hash
     */
    update: function(contextObject, bytes){
        var inputBuffer = this.internal.bufferFromBytes(bytes);
        let bitLength = bytes.length*8; //param databitlen: [data portion's] length in bits
        this.internal.update(contextObject.context, inputBuffer, bitLength);
        this.internal.destroy_buffer(inputBuffer);
    },
    
    /**
     * Update the hashing context with new input data
     * @param {Object} contextObject the context object for this hashing session
     * @param {Object} value the value to use as bytes to update the hash calculation. Must be String or Uint8Array.
     */
    updateFromValue: function(contextObject, value){
        return this.update(contextObject, this.internal.inputToBytes(value));
    },
    
    /**
     * Finalizes the hashing session and produces digest ("hash") bytes.
     * Size of the returned array is always digest_size bytes long.
     * This method does not clean up the hashing context - be sure to call cleanup(ctx)!
     * @param {Object} contextObject the context object for this hashing session
     * @return {Uint8Array} an array of bytes representing the raw digest ("hash") value.
     */
    final: function(contextObject){
        var digestBuffer = this.internal.create_buffer(contextObject.digest_size_bytes);
        //console.log("create buffer "+digestBuffer)
        //this.internal.final(contextObject.context,digestBuffer,digestByteLen);
        this.internal.final(contextObject.context,digestBuffer);
        
        var digestBytes = this.internal.bytesFromBuffer(digestBuffer, contextObject.digest_size_bytes);
        //console.log("destroying buffer "+digestBuffer)
        this.internal.destroy_buffer(digestBuffer);
        return digestBytes;
    },
    
    /**
     * Cleans up and releases the Context object for the (now ended) hashing session.
     * @param {Object} contextObject the context object for this hashing session
     */
    cleanup: function(contextObject){
        this.internal.cleanup(contextObject.context);
    },
    
    /**
     * Calculates the Md6 message digest ("hash") for the input bytes or string
     * @param {Object} input the input value to hash - either Uint8Array or String
     * @param {Number} digest_size the number of bits for the digest size (512 or 256). 512 is default.
     * @return {Uint8Array} an array of bytes representing the raw digest ("hash") value.
     */
    digest: function (input, digest_size_bits) {
        input = this.internal.inputToBytes(input);
        var ctx = this.init(digest_size_bits);
        this.update(ctx,input);
        var bytes = this.final(ctx);
        this.cleanup(ctx);
        return bytes;
    },
    
    /**
     * Calculates the Md6 message digest ("hash") for the input bytes or string
     * @param {Object} input the input value to hash - either Uint8Array or String
     * @param {Number} digest_size the number of bits for the digest size (512 or 256). 512 is default.
     * @return {String} a hexadecimal representation of the digest ("hash") bytes.
     */
    digestHex: function (input, digest_size_bits) {
        var bytes = this.digest(input,digest_size_bits);
        return this.internal.toHex(bytes);
    }
};

createMd6Module().then(async module => {
    md6.version= module.cwrap('version', 'number', []);
    md6.internal.create_buffer= module.cwrap('malloc', 'number', ['number']);
    md6.internal.destroy_buffer= module.cwrap('free', '', ['number']);
    md6.internal.init= module.cwrap('md6_init_easy', '', ['number']);
    md6.internal.update= module.cwrap('md6_update', 'number', ['number','number','number']);
    md6.internal.final= module.cwrap('md6_final', 'number', ['number','number']);
    md6.internal.cleanup= module.cwrap('md6_cleanup_easy', '', ['number']);
    md6.internal.module = module;
});
