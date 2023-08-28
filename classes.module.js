class O_byte_offset_property{
    constructor(
        s_name, 
        n_bits, // 1, 2, 3, 4, 5, if type int or float it will get ceiled to multiple of 8
        s_type, // int, float, string
        b_negative,
        value_default,
        b_big_endian = false, 
        f_value_by_bytes = null,
        o_dataview_a_nu8 = null,
    ){
        
        this.s_name = s_name
        this.n_bits = n_bits
        this.s_type = s_type
        this.b_negative = b_negative
        this.value_default = value_default
        this.b_big_endian = b_big_endian
        this.f_value_by_bytes = f_value_by_bytes

        this.n_bits = n_bits
        this.n_bytes_ceiled_to_multiple_of_8 = Math.ceil((this.n_bits)/8);
        this.n_bits_ceiled_to_multiple_of_8 = this.n_bytes_ceiled_to_multiple_of_8*8;
        this.s_name = s_name 
        this.s_type = s_type
        this.b_negative = b_negative
        this.value_default = value_default

        this.b_big_endian = b_big_endian
        if(f_value_by_bytes != null){
            this.f_value_by_bytes = f_value_by_bytes
        }
        this.o_dataview_a_nu8 = o_dataview_a_nu8
       
        //
        this.o_text_decoder_utf8 = new TextDecoder("utf-8")
        this.o_text_encoder_utf8 = new TextEncoder("utf-8")
    }
    f_value(){

        var s_function_name = `get${this.f_s_dataview_function_suffix()}`;

        if(this.s_type == "string"){
            var value = this.o_text_decoder_utf8.decode(this.o_dataview_a_nu8); //version 1 thanks @AapoAlas 
        }
        if(this.s_type != "string"){
            var value = this.o_dataview_a_nu8[s_function_name](0, !this.b_big_endian);
        }

        // console.log("---")
        // console.log("this.s_name")
        // console.log(this.s_name)
        // console.log("this.o_dataview_a_nu8")
        // console.log(this.o_dataview_a_nu8)
        // console.log("value")
        // console.log(value)

        return value;
    }
    f_set_value(value){
        var n_byte_length = this.n_bits_ceiled_to_multiple_of_8/8;

        var s_function_name = `set${this.f_s_dataview_function_suffix()}`;

        if(this.s_type == "string"){
            var a_n_u8 = this.o_text_encoder_utf8.encode(value); //version 1 thanks @AapoAlas 
            if(a_n_u8.byteLength > n_byte_length){
                console.log(`warning: byte length of input string ${value} is bigger than 'n_bits_ceiled_to_multiple_of_8/8' ${this.n_bits_ceiled_to_multiple_of_8}`);
            }
            a_n_u8 = a_n_u8.subarray(0, n_byte_length);
            var n_i = 0; 
            while(n_i < n_byte_length){
                this.o_dataview_a_nu8.setUint8(((!this.b_big_endian) ? (n_byte_length-1)-n_i : n_i), a_n_u8[n_i], !this.b_big_endian);
                n_i+=1;
            }

            //we cannot easily set a string on a dataview so we have to convert it into a number
        }

        if(this.s_type != "string"){
            this.o_dataview_a_nu8[s_function_name](0, value, !this.b_big_endian);
        }
       
    }
    f_s_dataview_function_suffix(){
        //possible function names: getUint8,getUint16,getUint32,getUint64,getInt8,getInt16,getInt32,getFloat32,getFloat64
        if(this.b_negative){
            var s_type_abb = "Float";
            if(this.s_type.toLowerCase().includes("int")){
                s_type_abb = "Int"
            }
        }else{
            var s_type_abb = "Float";
            if(this.s_type.toLowerCase().includes("int")){
                s_type_abb = "int"
                s_type_abb = "U"+s_type_abb;
            }
        }
        return `${s_type_abb}${this.n_bits_ceiled_to_multiple_of_8}`
    }
}

class O_file{
    constructor(
        s_name, 
        s_description,
        a_s_extension, 
        a_s_mime_type, 
        a_n_u8__data, 
        a_o_byte_offset_property__header,
        o_dataview_a_nu8
    ){
        this.s_name = s_name, 
        this.s_description = s_description,
        this.a_s_extension = a_s_extension, 
        this.a_s_mime_type = a_s_mime_type, 
        this.a_n_u8__data = a_n_u8__data, 
        this.a_o_byte_offset_property__header = a_o_byte_offset_property__header,
        this.o_dataview_a_nu8 = o_dataview_a_nu8
        this.n_file_header_end_byte_index = this.a_o_byte_offset_property__header.reduce(
            (n, o)=>{
                let n_idx_start = n;
                o.o_dataview_a_nu8 = new DataView(this.a_n_u8__data.buffer, n, o.n_bytes_ceiled_to_multiple_of_8);
                console.log(o.s_name)
                Object.defineProperty(
                    this,
                    o.s_name,
                    {
                        enumerable: true,
                        get() {
                            return o.f_value();
                            // console.log("get");
                            // return this[`_${o.s_name}`];
                        },
                    
                        set(value) {
                            this['_'+o.s_name] = value;
                            o.f_set_value(value);
                        }
                    }
                );

                return n+o.n_bytes_ceiled_to_multiple_of_8
            
            },0
        );

    }
}

export {
    O_file, 
    O_byte_offset_property
}