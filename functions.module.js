
import { O_byte_offset_property, O_file, O_file__wav} from "./classes.module.js";

let f_o_file__wav__decode_a_n_u8__wav = [
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
];
let f_o_file__wav__encode_a_n_u8 = function(
    a_n_u8
){
    let o_file__wav = new O_file(
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
        a_n_u8,
        f_o_file__wav__decode_a_n_u8__wav,
    );
}

let f_o_file__wav__decode_a_n_u8 = function(
    a_n_u8
){

    let o_file__wav = new O_file(
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
        a_n_u8,
        f_o_file__wav__decode_a_n_u8__wav,
    );

    let O_typed_array = (o_file__wav.n_bits_per_sample > 16) ? Int32Array : Int16Array;
    o_file__wav.a_n__audio_data = new O_typed_array(o_file__wav.a_n_u8__data.buffer, o_file__wav.n_file_header_end_byte_index)

    o_file__wav.a_a_n_sample__channels = new Array(o_file__wav.n_channels).fill(
        new O_typed_array(o_file__wav.a_n__audio_data.length / o_file__wav.n_channels)
    );
    // console.log(o_file__wav.a_a_n_sample__channels)
    // Deno.exit()
    let n_rms_group_length = 100;
    o_file__wav.a_a_n_rms100samples__channels = new Array(o_file__wav.n_channels).fill(
        new O_typed_array(o_file__wav.a_n__audio_data.length / n_rms_group_length)
    );
    

    o_file__wav.n_rms100samples__max = 0;
    o_file__wav.a_a_n_sample_max_n_sample_min_n_sample_avg = new Array(o_file__wav.n_channels).fill([
        0, // max 
        Math.pow(2,o_file__wav.n_bits_per_sample)-1, // min
        0 // avg
    ]);


    for(
        var n_i_channel = 0; 
        n_i_channel< o_file__wav.n_channels;
        n_i_channel+=1
    ){
        let n_sample_avg = 0;
        let n_sum_sample100_squared = 0;
        let n_idx_a_a_n_rms100samples__channels = 0;
        for(
            var n_i_sample = 0;
            n_i_sample < o_file__wav.a_n__audio_data.length;
            n_i_sample+=1
        ){
            var n_i_sample_for_channel = n_i_sample*o_file__wav.n_channels+n_i_channel;

            var n_sample_value = o_file__wav.a_n__audio_data[n_i_sample_for_channel];//amplitude of current sample 

            o_file__wav.a_a_n_sample_max_n_sample_min_n_sample_avg[n_i_channel][0] = Math.max(
                o_file__wav.a_a_n_sample_max_n_sample_min_n_sample_avg[n_i_channel][0], 
                n_sample_value   
            )


            o_file__wav.a_a_n_sample_max_n_sample_min_n_sample_avg[n_i_channel][1] = Math.min(
                o_file__wav.a_a_n_sample_max_n_sample_min_n_sample_avg[n_i_channel][1], 
                n_sample_value   
            )
            o_file__wav.a_a_n_sample_max_n_sample_min_n_sample_avg[n_i_channel][2] += n_sample_value;

            let n_sample_squared = n_sample_value*n_sample_value;
            n_sum_sample100_squared+=n_sample_squared;

            if(n_i_sample % n_rms_group_length == 0){
                let n_rms = Math.sqrt(n_sum_sample100_squared/n_rms_group_length)
                if(n_rms > o_file__wav.n_rms100samples__max){o_file__wav.n_rms100samples__max = n_rms}
                n_sum_sample100_squared = 0;
                o_file__wav.a_a_n_rms100samples__channels[n_i_channel][n_idx_a_a_n_rms100samples__channels] = (n_rms);
                n_idx_a_a_n_rms100samples__channels+=1;
            }
            // since we loop anyways, we can do some statistics...
            // if(n_sample_value > this.a_a_n_max_min_avg[n_i_channel][0]){
            //     this.a_a_n_max_min_avg[n_i_channel][0] = n_sample_value
            // }
            // if(n_sample_value < this.a_a_n_max_min_avg[n_i_channel][1]){
            //     this.a_a_n_max_min_avg[n_i_channel][1] = n_sample_value
            // }
            // this.a_a_n_max_min_avg[n_i_channel][2]+= (n_sample_value/n_max_amp_possible);

            o_file__wav.a_a_n_sample__channels[n_i_channel][n_i_sample] = (n_sample_value);
        }
        o_file__wav.a_a_n_sample_max_n_sample_min_n_sample_avg[n_i_channel][2] /= o_file__wav.a_n__audio_data.length
    }

    return o_file__wav
}

// let a_n_u8 = await Deno.readFile("./wav_files/ImperialMarch60.wav");
// let o_file__wav = f_o_file__wav__decode_a_n_u8(a_n_u8);

// console.log(o_file__wav.a_a_n_rms1000samples__channels)

import {  createCanvas } from "https://deno.land/x/canvas/mod.ts";


let f_s_data_url_image__from_o_file__wav = async function(
    o_file__wav,
    n_nor_start = 0, 
    n_nor_end = 1,
    n_scl_x_px, 
    n_scl_y_px
){


    const o_canvas = createCanvas(n_scl_x_px, n_scl_y_px);
    const o_ctx = o_canvas.getContext("2d");

    o_ctx.fillStyle = "red";
    console.log(o_file__wav.a_a_n_sample__channels[0].length)
    let n_nor_range = Math.abs(n_nor_end-n_nor_start);
    let n_len_rms_samples = o_file__wav.a_a_n_rms100samples__channels[0].length * n_nor_range;
    let n_idx_rms_offset = parseInt(n_nor_start * o_file__wav.a_a_n_rms100samples__channels[0].length);
    let n_idx_per_px = parseInt(n_len_rms_samples / o_canvas.width);

    for(let n_trn_x = 0; n_trn_x < o_canvas.width; n_trn_x+=1){

        let n_idx_a_a_n_rms100samples__channels__start = (n_idx_per_px*n_trn_x)+n_idx_rms_offset;
        let n_idx_a_a_n_rms100samples__channels__end = (n_idx_per_px*(n_trn_x+1))+n_idx_rms_offset;
        let n_rms_avg = 0;
        for(let n_idx_a_a_n_rms100samples__channels = n_idx_a_a_n_rms100samples__channels__start; n_idx_a_a_n_rms100samples__channels < n_idx_a_a_n_rms100samples__channels__end; n_idx_a_a_n_rms100samples__channels+=1){
            n_rms_avg +=o_file__wav.a_a_n_rms100samples__channels[0][n_idx_a_a_n_rms100samples__channels];
        }
        n_rms_avg = n_rms_avg / Math.abs(n_idx_a_a_n_rms100samples__channels__start-n_idx_a_a_n_rms100samples__channels__end)

        let n_rms_sample_val_nor = n_rms_avg / (Math.pow(2,o_file__wav.n_bits_per_sample)/2);//o_file__wav.a_a_n_sample_max_n_sample_min_n_sample_avg[0][0]//Math.pow(2, 16);
        o_ctx.fillRect(n_trn_x, 0, 1, n_rms_sample_val_nor*o_canvas.height);

    }

    await Deno.writeFile("melol.png", o_canvas.toBuffer());

}
//f_s_data_url_image__from_o_file__wav(o_file__wav, 0.0, .08, 1000, 200);

// console.log(o_file__wav)

    // f_set_o_dataview_a_nu8(o_dataview_a_nu8){
    //     this.o_dataview_a_nu8 = o_dataview_a_nu8;
    // }
    // f_value(){

    //     var s_function_name = `get${this.f_s_dataview_function_suffix()}`;

    //     if(this.s_type == "string"){
    //         var value = this.o_text_decoder_utf8.decode(this.o_dataview_a_nu8); //version 1 thanks @AapoAlas 
    //     }
    //     if(this.s_type != "string"){
    //         var value = this.o_dataview_a_nu8[s_function_name](0, !this.b_big_endian);
    //     }

    //     // console.log("---")
    //     // console.log("this.s_name")
    //     // console.log(this.s_name)
    //     // console.log("this.o_dataview_a_nu8")
    //     // console.log(this.o_dataview_a_nu8)
    //     // console.log("value")
    //     // console.log(value)

    //     return value;
    // }
    // f_set_value(value){
    //     var n_byte_length = this.n_bits_ceiled_to_multiple_of_8/8;

    //     var s_function_name = `set${this.f_s_dataview_function_suffix()}`;

    //     if(this.s_type == "string"){
    //         var a_n_u8 = this.o_text_encoder_utf8.encode(value); //version 1 thanks @AapoAlas 
    //         if(a_n_u8.byteLength > n_byte_length){
    //             console.log(`warning: byte length of input string ${value} is bigger than 'n_bits_ceiled_to_multiple_of_8/8' ${this.n_bits_ceiled_to_multiple_of_8}`);
    //         }
    //         a_n_u8 = a_n_u8.subarray(0, n_byte_length);
    //         var n_i = 0; 
    //         while(n_i < n_byte_length){
    //             this.o_dataview_a_nu8.setUint8(((!this.b_big_endian) ? (n_byte_length-1)-n_i : n_i), a_n_u8[n_i], !this.b_big_endian);
    //             n_i+=1;
    //         }

    //         //we cannot easily set a string on a dataview so we have to convert it into a number
    //     }

    //     if(this.s_type != "string"){
    //         this.o_dataview_a_nu8[s_function_name](0, value, !this.b_big_endian);
    //     }
       
    // }
    // f_s_dataview_function_suffix(){
    //     //possible function names: getUint8,getUint16,getUint32,getUint64,getInt8,getInt16,getInt32,getFloat32,getFloat64
    //     if(this.b_negative){
    //         var s_type_abb = "Float";
    //         if(this.s_type.toLowerCase().includes("int")){
    //             s_type_abb = "Int"
    //         }
    //     }else{
    //         var s_type_abb = "Float";
    //         if(this.s_type.toLowerCase().includes("int")){
    //             s_type_abb = "int"
    //             s_type_abb = "U"+s_type_abb;
    //         }
    //     }
    //     return `${s_type_abb}${this.n_bits_ceiled_to_multiple_of_8}`
    // }


let f_fetch_a_n_u8 = async function(
    s_url
){
    return new Promise(
        (f_res)=>{
            fetch(s_url).then(
                o_resp =>{
                    console.log("is the data here already on my local machine?") // here
                    // o_resp.body()
        
                    o_resp.arrayBuffer().then(
                        (o_buffer)=>{
                            return f_resolve(new Uint8Array());
                        }
                    );
                    
                }
            )
        }
    )
}


let f_test = async function(){

    let o_file__wav = new O_file__wav();

    console.log(o_file__wav.o_file.a_n_u8__header)

    // o_file__wav.o_file.a_n_u8 = new Uint8Array(
    //     new Array(100).fill(0).map(
    //     ()=>{
    //         return parseInt(Math.random()*255)
    //     }
    //     )
    // )

    o_file__wav.o_file.n_channels = 2
    o_file__wav.o_file.n_bits_per_sample = 8//not yet working

    console.log(o_file__wav.o_file.a_n_u8__header)

    o_file__wav.o_file.a_n_u8__after_header = new Uint8Array(
        new Array(1000000).fill(0).map(
        (v,n_idx)=>{
            if(parseInt(n_idx)%2 == 1){
            // if(parseInt(n_idx*.5)%2 == 1){
                return 0
            } 
            return Math.random()*255
        }
        )
    )
    console.log(o_file__wav.o_file.a_n_u8__header)

    console.log(o_file__wav.o_file.n_file_size_in_bytes_minus_8_bytes)
    console.log(o_file__wav.o_file.a_n_u8__header)
    console.log(o_file__wav.o_file.n_file_size_in_bytes_minus_8_bytes)

    // console.log(o_file__wav.n_file_size_in_bytes_minus_8_bytes)

    // console.log(o_file__wav.o_file.a_n_u8)
    // console.log(o_file__wav.n_file_size_in_bytes_minus_8_bytes)
    await Deno.writeFile("test.wav", o_file__wav.o_file.a_n_u8, { mode: 0o644 });
}

let f_o_file__wav__decode_from_a_n_u8_url = async function(s_url){
    return f_fetch_a_n_u8(s_url).then(
        (a_n_u8) =>{
            let s_name_file = s_url.split("/").pop();
        
            let o_file__wav = new O_file__wav(s_name_file);
            o_file__wav.o_file.a_n_u8 = a_n_u8
            return o_file__wav
        }
    )
}
let f_o_file__wav__decode_from_a_n_u8_file = function(
    a_n_u8__file, 
    s_name_file = ''
){
    let o_file__wav = new O_file__wav(s_name_file);
    o_file__wav.o_file.a_n_u8 = a_n_u8__file
    return o_file__wav
}
let f_o_image_from_o_file__wav = async function(
    o_file__wav, 
    n_aspect_ratio_x, 
    n_aspect_ratio_y, 
    // n_aspect_ratio_x_to_y = '1'
){
    let n_aspect_ratio_x_to_y = n_aspect_ratio_x / n_aspect_ratio_y;
    let n_possible_pixels = (o_file__wav.o_file.a_n_u8__after_header.length/4)
    let n_x = Math.sqrt(n_possible_pixels*n_aspect_ratio_x_to_y);
    let n_y = n_x / n_aspect_ratio_x_to_y;
    n_x = Math.ceil(n_x);
    n_y = Math.ceil(n_y);
    
    const o_canvas = createCanvas(n_x, n_y);
    const o_ctx = o_canvas.getContext("2d");

    let  f_draw_text_outlined = function(o_ctx, s_text, n_x, n_y) {
        o_ctx.strokeStyle = 'black';
        o_ctx.lineWidth = 8;
        o_ctx.strokeText(s_text, n_x,n_y);
        o_ctx.fillStyle = 'white';
        o_ctx.fillText(s_text, n_x, n_y);
    }

    const o_image_data = o_ctx.createImageData(o_canvas.width, o_canvas.height);

    // Copy your data into the ImageData object
    o_image_data.data.set(o_file__wav.o_file.a_n_u8);

    o_ctx.putImageData(o_image_data, 0, 0);

    o_ctx.font = '18px Sans-serif';
    let s_name_file = o_file__wav.s_name.split("/").pop();

    f_draw_text_outlined(
        o_ctx,
        `${s_name_file}, ${parseInt(o_file__wav.n_duration_seconds)} seconds, ${n_aspect_ratio_x}:${n_aspect_ratio_y}`, 
        36, 
        36
    )

    await Deno.writeFile(`${new Date().getTime()}_${s_name_file}_${n_aspect_ratio_x}to${n_aspect_ratio_y}.png`, o_canvas.toBuffer());

}


// o_file__wav.o_file.a_n_u8__after_header = new Uint8Array(new Array(100).fill(0))

let a_s_name_file = [
    './CantinaBand60.wav', 
    './BabyElephantWalk60.wav', 
    './ImperialMarch60.wav', 
    './PinkPanther60.wav',
    './y2mate.com - Zelda Chill Fairy Fountain Mikel Lofi Remix.wav'
]
for(let s of a_s_name_file){

    let a_n_u8__file = await Deno.readFile(s);
    let o_file__wav = f_o_file__wav__decode_from_a_n_u8_file(
        a_n_u8__file,
        s
    );
    f_o_image_from_o_file__wav(o_file__wav, 16, 9)
}