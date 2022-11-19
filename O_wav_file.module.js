class O_byte_offset_property{
    constructor(
        s_name, 
        n_bits, // 1, 2, 3, 4, 5, if type int or float it will get ceiled to multiple of 8
        s_type, // int, float, string
        b_negative,
        value_default,
        b_big_endian = false, 
        f_value_by_bytes = null, 
    ){
        this.o_text_decoder_utf8 = new TextDecoder("utf-8")
        this.o_text_encoder_utf8 = new TextEncoder("utf-8")
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
    }
    f_set_o_dataview_a_nu8(o_dataview_a_nu8){
        this.o_dataview_a_nu8 = o_dataview_a_nu8;
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
class O_file_header{
    constructor(
        a_o_byte_offset_property, 
    ){
        this.a_o_byte_offset_property = a_o_byte_offset_property;
    }
    f_set_dataview_and_define_property(
        o_dataview_a_nu8, 
        o_byte_offset_property
    ){
        o_byte_offset_property.f_set_o_dataview_a_nu8(o_dataview_a_nu8);
        Object.defineProperty(
            this,
            o_byte_offset_property.s_name,
            {
                get() {
                    // console.log("get");
                    return this[`_${o_byte_offset_property.s_name}`];
                },
            
                set(value) {
                    this['_'+o_byte_offset_property.s_name] = value;
                    o_byte_offset_property.f_set_value(value);
                }
            }
        );
    }
    f_a_n_u8(){
        var a_n_u8 = new Uint8Array(this.n_file_header_end_byte_index);
        var n_byte_index = 0;
        for(var o_byte_offset_property of this.a_o_byte_offset_property){
            var o_dataview_a_nu8 = new DataView(a_n_u8.buffer, n_byte_index, o_byte_offset_property.n_bytes_ceiled_to_multiple_of_8);
            this.f_set_dataview_and_define_property(o_dataview_a_nu8, o_byte_offset_property);
            this[o_byte_offset_property.s_name] = o_byte_offset_property.value_default;
            n_byte_index+=o_byte_offset_property.n_bytes_ceiled_to_multiple_of_8;
        }
        return a_n_u8;
    }
    f_detect_from_array(a_nu8){
        var n_byte_index = 0;
        for(var o_byte_offset_property of this.a_o_byte_offset_property){
            var o_dataview_a_nu8 = new DataView(a_nu8.buffer, n_byte_index, o_byte_offset_property.n_bytes_ceiled_to_multiple_of_8);
            this.f_set_dataview_and_define_property(o_dataview_a_nu8, o_byte_offset_property);
            var value = o_byte_offset_property.f_value();
            this[o_byte_offset_property.s_name] = value;
            n_byte_index+=o_byte_offset_property.n_bytes_ceiled_to_multiple_of_8;
        }
    }
}
class O_wav_file{
    constructor(
    ){  
        this.o_file_header = "please call 'await o_wav_file.f_read_file(s_path_file)'";
        this.a_n__data = "please call 'await o_wav_file.f_read_file(s_path_file)'";
        this.a_n__header = "please call 'await o_wav_file.f_read_file(s_path_file)'";
        this.a_n_u8 = "please call 'await o_wav_file.f_read_file(s_path_file)'";
        this.n_file_header_end_byte_index = 44;
    }
    async f_read_file(
        s_path_file,
        b_slower_but_convinient
        ){
        this.s_path_file = s_path_file;
        // const o_file = await Deno.open(s_path_file);
        this.a_n_u8 = await Deno.readFile(s_path_file);
        var o_file_header = this.f_o_file_header();
        o_file_header.f_detect_from_array(this.a_n_u8)
        this.o_file_header = o_file_header;
        console.log(this.o_file_header);

        this.a_n_u8__header = new Uint8Array(new DataView(this.a_n_u8.buffer, 0, this.n_file_header_end_byte_index).buffer)

        if(this.o_file_header.bits_per_sample > 16){
            // there is no Uint24Array
            var O_typed_array = Int32Array;
        }else{
            var O_typed_array = Int16Array;
        }
        this.a_n__data = new O_typed_array(this.a_n_u8.buffer, this.n_file_header_end_byte_index)
        var n_max_amp_possible = (Math.pow(2, this.o_file_header.n_bits_per_sample)-1);
        
        if(b_slower_but_convinient){    
            this.a_a_n_sample__channels = Array.from({length: this.o_file_header.n_channels}, (_, i) => new O_typed_array(this.a_n__data.length/this.o_file_header.n_channels));
            this.a_a_n_max_min_avg = Array.from({length: this.o_file_header.n_channels}, (_, i) => new O_typed_array(3));
            for(
                var n_i_channel = 0; 
                n_i_channel< this.o_file_header.n_channels;
                n_i_channel+=1
            ){
                for(
                    var n_i_sample = 0;
                    n_i_sample < this.a_n__data.length;
                    n_i_sample+=1
                ){
                    var n_i_sample_for_channel = n_i_sample*this.o_file_header.n_channels+n_i_channel;
                    var n_sample_value = this.a_n__data[n_i_sample_for_channel];//amplitude of current sample 
                    // since we loop anyways, we can do some statistics...
                    if(n_sample_value > this.a_a_n_max_min_avg[n_i_channel][0]){
                        this.a_a_n_max_min_avg[n_i_channel][0] = n_sample_value
                    }
                    if(n_sample_value < this.a_a_n_max_min_avg[n_i_channel][1]){
                        this.a_a_n_max_min_avg[n_i_channel][1] = n_sample_value
                    }
                    this.a_a_n_max_min_avg[n_i_channel][2]+= (n_sample_value/n_max_amp_possible);

                    this.a_a_n_sample__channels[n_i_channel][n_i_sample] = n_sample_value;
                }
            }
        }
    }
    async f_create_from_array(
        n_channels,
        n_bits_per_sample, 
        n_samples_per_second_per_channel,
        a_n__data
    ){
        
        var n_bits_per_sample = a_n__data.BYTES_PER_ELEMENT*8;
        var o_file_header = this.f_o_file_header();
        var a_n_u8__header = o_file_header.f_a_n_u8();
        o_file_header.n_channels = n_channels;
        o_file_header.n_bits_per_sample = n_bits_per_sample;
        o_file_header.n_samples_per_second_per_channel = n_samples_per_second_per_channel;
        o_file_header.n_bits_per_sample_times_channels = n_bits_per_sample * n_channels;
        o_file_header.n_samples_per_second_per_channel_times_bits_per_sample_times_channel__dividedby8 =
            (n_samples_per_second_per_channel * n_bits_per_sample * n_channels) /8; 
        
        var a_n_u8__data = new Uint8Array(a_n__data.buffer);
        var a_n_u8__header_and_data = new Uint8Array(a_n_u8__header.length + a_n_u8__data.length);
        a_n_u8__header_and_data.set(a_n_u8__header);
        a_n_u8__header_and_data.set(a_n_u8__data, a_n_u8__header.length);
        o_file_header.n_data_size_in_bytes = a_n_u8__data.length;
        o_file_header.n_file_size_in_bytes_minus_8_bytes = a_n_u8__header_and_data.length-8;
        console.log(o_file_header)
        this.a_n_u8 = a_n_u8__header_and_data;
    
    }

    async f_write_file(s_path_file, b_slower_but_convinient){
        if(this.a_a_n_sample__channels != undefined){
            b_slower_but_convinient = true;
        }
        if(b_slower_but_convinient){    
            for(
                var n_i_channel = 0; 
                n_i_channel< this.o_file_header.n_channels;
                n_i_channel+=1
            ){
                for(
                    var n_i_sample = 0;
                    n_i_sample < this.a_a_n_sample__channels[n_i_channel].length;
                    n_i_sample+=1
                ){
                    var n_i_sample_for_channel = n_i_sample*this.o_file_header.n_channels+n_i_channel;
                    var n_sample_value = this.a_a_n_sample__channels[n_i_channel][n_i_sample];
                    this.a_n__data[n_i_sample_for_channel] = n_sample_value;
                }
            }
        }
        var a_n_u8__data = new Uint8Array(this.a_n__data.buffer);
        console.log(this.a_n__data);
        // console.log(this.a_n__data);

        var a_n_u8__header_and_data = new Uint8Array(this.a_n_u8__header.length + a_n_u8__data.length);
        a_n_u8__header_and_data.set(this.a_n_u8__header);
        // console.log(this.a_n_u8__header)
        // console.log(a_n_u8__header_and_data)
        a_n_u8__header_and_data.set(a_n_u8__data, this.a_n_u8__header.length);
        // console.log(a_n_u8__header_and_data)
        this.o_file_header.n_data_size_in_bytes = a_n_u8__data.length;
        this.o_file_header.n_file_size_in_bytes_minus_8_bytes = a_n_u8__header_and_data.length-8;
        // console.log(this.o_file_header)
        this.a_n_u8 = a_n_u8__header_and_data;

        await Deno.writeFile(s_path_file, this.a_n_u8.buffer, { mode: 0o644 });
    }
    
    f_o_file_header(){
        var o_file_header = new O_file_header(
            [
                new O_byte_offset_property(
                    's_riff_mark',
                    4 * 8,
                    'string', 
                    false,
                    "RIFF",
                    true, 
                    null
                ), 
                new O_byte_offset_property(
                    'n_file_size_in_bytes_minus_8_bytes',
                    4 * 8,
                    'integer',
                    true,
                    0,
                    false, 
                    null
                ), 
                new O_byte_offset_property(
                    's_wave_mark',
                    4 * 8,
                    'string',
                    false,
                    "WAVE",
                    true, 
                    null
                ), 
                new O_byte_offset_property(
                    's_fmt_mark',
                    4 * 8,
                    'string',
                    false,
                    "fmt ",
                    true, 
                    null 
                ), 
                new O_byte_offset_property(
                    'n_fmt_chunk_size',
                    4 * 8,
                    'integer',
                    false,
                    16,// 16 for pcm
                    false, 
                    null
                ), 
                new O_byte_offset_property(
                    'n_compression_code',
                    2 * 8,
                    'integer',
                    false,
                    1,
                    false, 
                    null
                ),
                new O_byte_offset_property(
                    'n_channels',
                    2 * 8,
                    'integer',
                    false,
                    1,
                    false, 
                    null
                ),
                new O_byte_offset_property(
                    'n_samples_per_second_per_channel',
                    4 * 8,
                    'integer',
                    false,
                    22050,
                    false, 
                    null
                ),
                new O_byte_offset_property(
                    'n_samples_per_second_per_channel_times_bits_per_sample_times_channel__dividedby8',
                    4 * 8,
                    'integer',
                    false,
                    (22050*16*1)/8,
                    false, 
                    null
                ),
                new O_byte_offset_property(
                    'n_bits_per_sample_times_channels',
                    2 * 8,
                    'integer',
                    false,
                    16*1,
                    false, 
                    null
                ),
                new O_byte_offset_property(
                    'n_bits_per_sample',
                    2 * 8,
                    'integer',
                    false,
                    16,
                    false, 
                    null
                ),
                new O_byte_offset_property(
                    's_data_mark',
                    4 * 8,
                    'string',
                    false,
                    "data",
                    true, 
                    null
                ),
                new O_byte_offset_property(
                    'n_data_size_in_bytes',
                    4 * 8,
                    'integer',
                    false,
                    0,
                    false, 
                    null
                ),
            ]
        );
        return o_file_header;
        // 1 - 4	“RIFF”	Marks the file as a riff file. Characters are each 1 byte long.
        // 5 - 8	File size (integer)	Size of the overall file - 8 bytes, in bytes (32-bit integer). Typically, you’d fill this in after creation.
        // 9 -12	“WAVE”	File Type Header. For our purposes, it always equals “WAVE”.
        // 13-16	“fmt "	Format chunk marker. Includes trailing null
        // 17-20	16	Length of format data as listed above
        // 21-22	1	Type of format (1 is PCM) - 2 byte integer
        // 23-24	2	Number of Channels - 2 byte integer
        // 25-28	44100	Sample Rate - 32 byte integer. Common values are 44100 (CD), 48000 (DAT). Sample Rate = Number of Samples per second, or Hertz.
        // 29-32	176400	(Sample Rate * BitsPerSample * Channels) / 8.
        // 33-34	4	(BitsPerSample * Channels) / 8.1 - 8 bit mono2 - 8 bit stereo/16 bit mono4 - 16 bit stereo
        // 35-36	16	Bits per sample
        // 37-40	“data”	“data” chunk header. Marks the beginning of the data section.
        // 41-44	File size (data)	Size of the data section.
    }
}
export {O_wav_file}