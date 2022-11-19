/*md
# O_wav_file
## import 
md*/
//```javascript
import { O_wav_file } from "./O_wav_file.module.js";
//```

// //md ## read/open file
// //```javascript
// var o_wav_file = new O_wav_file();
// var s_path_file = "./wav_files/ImperialMarch60.wav"
// var s_path_file = "./wav_files/wav5196.wav"
// var s_path_file = "./wav_files/classical.wav"
// var b_slower_but_convinient = true;
// await o_wav_file.f_read_file(s_path_file, b_slower_but_convinient);
// //```

// //md ## change data
// //md for example: mute one channel
// //md if we know that it is a stereo file and we just want to change the right channel for example
// //```javascript
// var n_left = 0;
// var n_right = 1;
// var n_i_channel = n_right;
// for(var n_i_sample = 0; n_i_sample < o_wav_file.a_a_n_sample__channels[n_i_channel].length; n_i_sample+=1){
//     o_wav_file.a_a_n_sample__channels[n_i_channel][n_i_sample] = 0;
// } 
// o_wav_file.f_write_file(s_path_file.split(".").slice(0, -1).join('.')+('_out.wav'));
// //```


//md ## convert image into wav file

// import JPEG from "https://deno.land/x/jpeg/mod.ts";

// const img = await Deno.readFile("./wav_files/alvan-nee-ZCHj_2lJP00-unsplash.jpg");
// const raw = JPEG.decode(img);

// console.log(img);

import { decode } from "https://deno.land/x/pngs/mod.ts";

var s_path_file_image = "./wav_files/Moire-Pattern-High-Res.png";
const file = await Deno.readFile(s_path_file_image);

var o_file_png = decode(file);

console.log(o_file_png);
var a_n__data = new Int8Array(o_file_png.image.buffer);

console.log(a_n__data);

var o_wav_file = new O_wav_file();
o_wav_file.f_create_from_array(
    1,//n_channels,
    8,//n_bits_per_sample, 
    44100,//n_samples_per_second_per_channel,
    a_n__data, //
);
await o_wav_file.f_write_file(s_path_file_image+'.wav')
// var n_i_channel = 0;
// Math.max.apply(null,a.subarray(5, 7));
// var n_max_amp_found = Math.max.apply(null,o_wav_file.a_n__data);
// console.log("max sample value as integer is "+ n_max_amp_found);
// var n_max_amp_possible = (Math.pow(2, o_wav_file.o_file_header.n_bits_per_sample)-1);

// for(
//     n_i_channel = 0; 
//     n_i_channel< o_wav_file.o_file_header.n_channels;
//     n_i_channel+=1
// ){
//     for(
//         var n_i_sample = 0;
//         n_i_sample < o_wav_file.a_n__data.length;
//         n_i_sample+=1
//     ){ 
//         var n_i_sample_for_channel = n_i_sample*o_wav_file.o_file_header.n_channels+n_i_channel;
//         var n_sample_value = o_wav_file.a_n__data[n_i_sample_for_channel];//amplitude of current sample 
//         o_wav_file.a_n__data[n_i_sample_for_channel] = 
//         (n_sample_value / n_max_amp_found) * n_max_amp_possible; 
//     }
// }
// console.log(o_wav_file.a_n__data)



 
// o_wav_file.f_write_file(s_path_file.split(".").slice(0, -1).join('.')+('_out.wav'));

// { ...  _s_riff_mark: "RIFF",  _n_file_size_in_bytes_minus_8_bytes: 2646036,  _s_wave_mark: "WAVE",  _s_fmt_mark: "fmt ",  _n_fmt_chunk_size: 16,  _n_compression_code: 1,  _n_number_of_channels: 1,  _n_samples_per_second_per_channel: 22050,  _n_samples_per_second_per_channel_times_bits_per_sample_times_channel__dividedby8: 44100,  _n_bits_per_sample_times_channels: 2,  _n_bits_per_sample: 16,  _s_data_mark: "data",_n_data_size_in_bytes: 2646000 }



// var o_png = await  f_create_png(
//     1080, 
//     512, 
//     o_wav_file.a_n__data, 
//     './test.png'
// );

// var o_wav_file = new O_wav_file();

// var n_length_bytes = 100000;
// var a_n_u16_whitenoise = new Int16Array(n_length_bytes);
// var n_i = 0;
// var n_max_amp = Math.pow(2,16)/2;

// while(n_i< n_length_bytes){
//     var n_amp = Math.sin(6.2831*(n_i/n_length_bytes)*n_i)*n_max_amp;
//     a_n_u16_whitenoise[n_i] = (Math.random()-0.5)*n_amp;
//     n_i+=1;
// }
// o_wav_file.f_create_from_array(
//     1, 
//     22050,
//     a_n_u16_whitenoise
// );


// // 2 seconds silence 
// var s_path_file = "./out_2_seconds_silence.wav"
// var o_wav_file = new O_wav_file();
// var n_samples_per_second_per_channel = 44100;
// var n_channels = 1;
// var n_bits_per_sample = 16;
// var n_bytes_per_second = (n_bits_per_sample/8) * n_samples_per_second_per_channel * n_channels;
// var n_milliseconds = 2 * 1000;
// var n_bytes = n_bytes_per_second * (n_milliseconds/1000);
// var a_n_u16_whitenoise = new Int16Array(n_bytes);
// var n_i = 0;
// var n_amp = 0;
// while(n_i < n_bytes){
//     a_n_u16_whitenoise[n_i] = n_amp;
//     n_i+=1;
// }
// o_wav_file.f_create_from_array(
//     n_channels,
//     n_bits_per_sample, 
//     n_samples_per_second_per_channel,
//     a_n_u16_whitenoise
// );
// o_wav_file.f_write_file(s_path_file);


// // 2 seconds sine wave 333 hz 
// var s_path_file = "./out_2_seconds_333hz_sine.wav"
// var o_wav_file = new O_wav_file();
// var n_samples_per_second_per_channel = 44100;
// var n_channels = 1;
// var n_bits_per_sample = 16;
// var n_milliseconds = 2000;
// var n_samples_total = n_samples_per_second_per_channel * n_channels * (n_milliseconds/1000);
// var a_n_i16_data = new Int16Array(n_samples_total);
// var n_amp_max = (Math.pow(2, n_bits_per_sample)-1);
// var n_tau = Math.PI*2;
// var n_hz = 333;
// var n_tau_per_second = n_hz*n_tau;
// var n_tau_per_sample = n_tau_per_second / n_samples_per_second_per_channel;
// var n_ms_per_sample = 1000/n_samples_per_second_per_channel;
// var n_i_sample = 0;
// var n_ms_current = 0;
// while(n_i_sample < a_n_i16_data.length/n_channels){
//     var n_i_channel = 0;
//     n_ms_current+=n_ms_per_sample;
//     while(n_i_channel < n_channels){
//         a_n_i16_data[n_i_sample+n_i_channel] = (Math.sin(n_tau_per_sample*n_i_sample) * (n_amp_max/2.0));
//         n_i_channel+=1;
//     }
//     n_i_sample+=n_channels;
// }
// o_wav_file.f_create_from_array(
//     n_channels,
//     n_bits_per_sample, 
//     n_samples_per_second_per_channel,
//     a_n_i16_data
// );
// // console.log(o_wav_file.o_file_header)
// o_wav_file.f_write_file(s_path_file);




// // 2 seconds saw tooth
// var s_path_file = "./out_2secs_333hz_sawtooth.wav"
// var o_wav_file = new O_wav_file();
// var n_samples_per_second_per_channel = 44100;
// var n_channels = 1;
// var n_bits_per_sample = 16;
// var n_milliseconds = 2000;
// var n_samples_total = n_samples_per_second_per_channel * n_channels * (n_milliseconds/1000);
// var a_n_i16_data = new Int16Array(n_samples_total);
// var n_amp_max = (Math.pow(2, n_bits_per_sample)-1);
// var n_tau = Math.PI*2;
// var n_hz = 333;
// var n_sample_modulo = n_samples_per_second_per_channel/n_hz;
// var n_tau_per_sample = n_tau_per_second / n_samples_per_second_per_channel;
// var n_ms_per_sample = 1000/n_samples_per_second_per_channel;
// var n_i_sample = 0;
// var n_ms_current = 0;
// while(n_i_sample < a_n_i16_data.length/n_channels){
//     var n_i_channel = 0;
//     n_ms_current+=n_ms_per_sample;
//     while(n_i_channel < n_channels){
//         var n_sample_normalized = (n_i_sample%n_sample_modulo) / n_sample_modulo;
//         a_n_i16_data[n_i_sample+n_i_channel] = n_sample_normalized * (n_amp_max/2.0) - (n_amp_max/2.0);
//         n_i_channel+=1;
//     }
//     n_i_sample+=n_channels;
// }
// o_wav_file.f_create_from_array(
//     n_channels,
//     n_bits_per_sample, 
//     n_samples_per_second_per_channel,
//     a_n_i16_data
// );
// // console.log(o_wav_file.o_file_header)
// o_wav_file.f_write_file(s_path_file);




// // 2 seconds 333hz left sine, right sawtooth
// var s_path_file = "./out_2secs_333hz_lsine_rsawtooth.wav"
// var o_wav_file = new O_wav_file();
// var n_samples_per_second_per_channel = 44100;
// var n_channels = 2;
// var n_bits_per_sample = 16;
// var n_milliseconds = 2000;
// var n_samples_total = n_samples_per_second_per_channel * n_channels * (n_milliseconds/1000);
// var a_n_i16_data = new Int16Array(n_samples_total);
// var n_amp_max = (Math.pow(2, n_bits_per_sample)-1);
// var n_tau = Math.PI*2;
// var n_hz = 333;
// var n_sample_modulo = n_samples_per_second_per_channel/n_hz;
// var n_tau_per_sample = n_tau_per_second / n_samples_per_second_per_channel;
// var n_ms_per_sample = 1000/n_samples_per_second_per_channel;
// var n_i_sample = 0;
// var n_ms_current = 0;
// var n_tau_per_second = n_hz*n_tau;
// var n_tau_per_sample = n_tau_per_second / n_samples_per_second_per_channel;
// while(n_i_sample < a_n_i16_data.length){
//     var n_i_channel = 0;
//     n_ms_current+=n_ms_per_sample;
//     var n_sample = n_i_sample/n_channels;
//     while(n_i_channel < n_channels){
//         if(n_i_channel == 0){
//             a_n_i16_data[n_i_sample+n_i_channel] = (Math.sin(n_tau_per_sample*(n_sample)) * (n_amp_max/2.0));
//         }else{
//             var n_sample_normalized = ((n_sample)%n_sample_modulo) / n_sample_modulo;
//             a_n_i16_data[n_i_sample+n_i_channel] = n_sample_normalized * (n_amp_max/2.0) - (n_amp_max/2.0);
//         }
//         n_i_channel+=1;
//     }
//     n_i_sample+=n_channels;
// }
// o_wav_file.f_create_from_array(
//     n_channels,
//     n_bits_per_sample, 
//     n_samples_per_second_per_channel,
//     a_n_i16_data
// );

// o_wav_file.f_write_file(s_path_file);
