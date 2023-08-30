class O_byte_offset_property{
    constructor(
        s_name, 
        n_bits, // 1, 2, 3, 4, 5, if type int or float it will get ceiled to multiple of 8
        s_type, // int, float, string
        b_negative,
        value_default,
        b_big_endian = false, 
        f_callback_before_get = ()=>{},
        f_callback_after_set = ()=>{},
        f_callback_after_update_a_n_u8 = (o_file)=>{},
    ){
        
        this.s_name = s_name
        this.n_bits = n_bits
        this.s_type = s_type
        this.b_negative = b_negative
        this.value_default = value_default
        this.b_big_endian = b_big_endian
        this.f_callback_before_get = f_callback_before_get
        this.f_callback_after_set = f_callback_after_set
        this.f_callback_after_update_a_n_u8 = f_callback_after_update_a_n_u8

        this.n_bits = n_bits
        this.n_bytes_ceiled_to_multiple_of_8 = Math.ceil((this.n_bits)/8);
        this.n_bits_ceiled_to_multiple_of_8 = this.n_bytes_ceiled_to_multiple_of_8*8;
        this.s_name = s_name 
        this.s_type = s_type
        this.b_negative = b_negative
        this.value_default = value_default

        this.b_big_endian = b_big_endian

        this.o_dataview_a_nu8 = null
       
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

class O_file__wav{
    constructor(
        s_name = 'file.wav'
    ){
        let o_self = this
        this.s_name = s_name;

        let a_o_byte_offset_property__header = [
            new O_byte_offset_property(
                's_riff_mark',
                4 * 8,
                'string', 
                false,
                "RIFF",
                true,
            ), 
            new O_byte_offset_property(
                'n_file_size_in_bytes_minus_8_bytes',
                4 * 8,
                'integer',
                true,
                0,
                false, 
                ()=>{},
                ()=>{},
                (o_self, o_file)=>{
                    // console.log("o_self")
                    o_file[o_self.s_name] = o_file.a_n_u8.length - 8
                    // console.log(o_self.set(o_file.a_n_u8.length))
                    // console.log(o_file)
                    // this.set(o_file.a_n_u8.length)
                }
            ), 
            new O_byte_offset_property(
                's_wave_mark',
                4 * 8,
                'string',
                false,
                "WAVE",
                true, 
            ), 
            new O_byte_offset_property(
                's_fmt_mark',
                4 * 8,
                'string',
                false,
                "fmt ",
                true, 
 
            ), 
            new O_byte_offset_property(
                'n_fmt_chunk_size',
                4 * 8,
                'integer',
                false,
                16,// 16 for pcm
                false, 

            ), 
            new O_byte_offset_property(
                'n_compression_code',
                2 * 8,
                'integer',
                false,
                1,
                false, 

            ),
            new O_byte_offset_property(
                'n_channels',
                2 * 8,
                'integer',
                false,
                1,
                false, 
                (o_self, o_file)=>{
                    // console.log(o_file.n_channels)
                },
                (o_self, o_file)=>{
                    console.log("after set")
                    console.log("after set")
                    console.log(o_file.n_channels)

                    o_file.n_samples_per_second_per_channel_times_bits_per_sample_times_channel__dividedby8 = 
                        (o_file.n_samples_per_second_per_channel * o_file.n_channels * o_file.n_bits_per_sample) / 8
                    
                    o_file.n_bits_per_sample_times_channels = 
                        (o_file.n_channels * o_file.n_bits_per_sample)
                },
                ),
            new O_byte_offset_property(
                'n_samples_per_second_per_channel',
                4 * 8,
                'integer',
                false,
                22050,
                false, 
                ()=>{},
                (o_self, o_file)=>{

                    o_file.n_samples_per_second_per_channel_times_bits_per_sample_times_channel__dividedby8 = 
                        (o_file.n_samples_per_second_per_channel * o_file.n_channels * o_file.n_bits_per_sample) / 8
                        
                }

            ),
            new O_byte_offset_property(
                'n_samples_per_second_per_channel_times_bits_per_sample_times_channel__dividedby8',
                4 * 8,
                'integer',
                false,
                (22050*16*1)/8,
                false, 

            ),
            new O_byte_offset_property(
                'n_bits_per_sample_times_channels',
                2 * 8,
                'integer',
                false,
                16*1,
                false,

            ),
            new O_byte_offset_property(
                'n_bits_per_sample',
                2 * 8,
                'integer',
                false,
                16,
                false, 
                ()=>{},
                (o_self, o_file)=>{
                    o_file.n_bits_per_sample_times_channels = 
                        (o_file.n_channels * o_file.n_bits_per_sample)
                }

            ),
            new O_byte_offset_property(
                's_data_mark',
                4 * 8,
                'string',
                false,
                "data",
                true, 

            ),
            new O_byte_offset_property(
                'n_data_size_in_bytes',
                4 * 8,
                'integer',
                false,
                0,
                false, 
                ()=>{},
                ()=>{},
                (o_self, o_file)=>{
                    // console.log("o_self")
                    o_file[o_self.s_name] = o_file.a_n_u8.length - o_file.n_file_header_end_byte_index
                    // console.log(o_self.set(o_file.a_n_u8.length))
                    // console.log(o_file)
                    // this.set(o_file.a_n_u8.length)
                }
            )
        ]

        let f_update_n_seconds_duration = function(o_file){

            let n_bytes_per_sample = (o_file.n_bits_per_sample /8)
            if(o_file.a_n_u8__after_header){

                let n_samples_per_channel = (o_file.a_n_u8__after_header.length / n_bytes_per_sample) / o_file.n_channels;
                let n_seconds_for_samples_per_channel = n_samples_per_channel / o_file.n_samples_per_second_per_channel;
                // console.log('n_seconds_for_samples_per_channel')
                o_self.n_seconds_duration = n_seconds_for_samples_per_channel
                // console.log(n_seconds_for_samples_per_channel)
            }
        }

        this.o_file = new O_file(
            'wav file', 
            'a file containing raw audio data', 
            ['.wav'], 
            [
                'audio/wav',
                'audio/vnd.wave',
                'audio/wave',
                'audio/x-pn-wav',
                'audio/x-wav',
            ],
            a_o_byte_offset_property__header, 
            (o_file, s_property)=>{
                f_update_n_seconds_duration(o_file)
            }
        );


    }
}
class O_file{
    constructor(
        s_name, 
        s_description,
        a_s_extension, 
        a_s_mime_type, 
        a_o_byte_offset_property__header,
        f_callback_after_set_property = (o_file, s_property)=>{}, 
    ){
        let o_self = this;

        this.s_name = s_name
        this.s_description = s_description
        this.a_s_extension = a_s_extension 
        this.a_s_mime_type = a_s_mime_type
        this.a_o_byte_offset_property__header = a_o_byte_offset_property__header
        this.f_callback_after_set_property = f_callback_after_set_property 
        this.n_file_header_end_byte_index = this.a_o_byte_offset_property__header.reduce(
            (n, o)=>{
                return n+o.n_bytes_ceiled_to_multiple_of_8
            },0
        );
        this._a_n_u8 = new Uint8Array(this.n_file_header_end_byte_index);

        let f_update_a_o_byte_offset_property__header = function(){
            let n_idx = 0;
            for(let o of o_self.a_o_byte_offset_property__header){
                o.o_dataview_a_nu8 = new DataView(o_self._a_n_u8.buffer, n_idx, o.n_bytes_ceiled_to_multiple_of_8)
                n_idx+=o.n_bytes_ceiled_to_multiple_of_8
            }
        }
        f_update_a_o_byte_offset_property__header();

        for(let o of this.a_o_byte_offset_property__header){
            Object.defineProperty(
                this,
                o.s_name,
                {
                    enumerable: true,
                    get() {
                        o.f_callback_before_get(o, o_self);
                        return o.f_value();
                        // console.log("get");
                        // return this[`_${o.s_name}`];
                    },
                
                    set(value) {
                        // this['_'+o.s_name] = value;
                        o.f_set_value(value);

                        o.f_callback_after_set(o, o_self);
                        o_self.f_callback_after_set_property(o_self, o.s_name);

                    }
                }
            );
            this[o.s_name] = o.value_default
        }

        Object.defineProperty(
            this,
            'a_n_u8',
            {
                enumerable: true,
                get() {
                    return this._a_n_u8
                },
            
                set(array) {
                    this._a_n_u8 = array;
                    f_update_a_o_byte_offset_property__header()
                    
                    o_self.f_callback_after_set_property(o_self, 'a_n_u8');

                }
            }
        );


        Object.defineProperty(
            this,
            'a_n_u8__header',
            {
                enumerable: true,
                get() {
                    return this.a_n_u8.subarray(0, this.n_file_header_end_byte_index);
                },
            }
        );
        Object.defineProperty(
            this,
            'a_n_u8__after_header',
            {
                enumerable: true,
                get() {
                    return this.a_n_u8
                },
            
                set(array) {
                    let a_n_u8 = new Uint8Array(
                        this.n_file_header_end_byte_index+
                        array.length
                    );
                    a_n_u8.set(this.a_n_u8.subarray(0, this.n_file_header_end_byte_index));
                    a_n_u8.set(array, this.n_file_header_end_byte_index);
                    
                    this.a_n_u8 = a_n_u8
                    

                    f_update_a_o_byte_offset_property__header()
                    for(let o of this.a_o_byte_offset_property__header){
                        // console.log(o)
                        o.f_callback_after_update_a_n_u8(o, o_self);
                    }
                }
            }
        );


    }

}


export {
    O_file, 
    O_byte_offset_property, 
    O_file__wav
}