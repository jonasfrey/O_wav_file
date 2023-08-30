<!-- {"s_msg":"this file was automatically generated","s_by":"f_generate_markdown.module.js","s_ts_created":"Thu Aug 31 2023 01:10:52 GMT+0200 (Central European Summer Time)","n_ts_created":1693437052102} -->
# import functions
```javascript
import {
    f_o_file__wav__from_a_n_u8,
    f_o_file__wav__from_a_n_u8__after_header,
    f_o_file__wav__from_a_n_u8__fetch_from_s_url
} from './functions.module.js'


```
a helper function that returns an html audio object with the wav loaded as object url
```javascript
let f_o_el_audio__from_o_file__wav = function(o_file__wav){
    let o_blob = new Blob([o_file__wav.o_file.a_n_u8], { type: 'audio/wav' });
    let o_url = URL.createObjectURL(o_blob);
    let o_el_audio = document.createElement("audio");
    o_el_audio.src = o_url;
    o_el_audio.controls = true;
    return o_el_audio;
}
```
# `f_o_file__wav__from_a_n_u8__after_header`: create a .wav file from a uint 8 array that contains audio data
```javascript

let n_max_amplitude_default_16_bit = ((Math.pow(2, 16)-1)/2.)
let o_file__wav = f_o_file__wav__from_a_n_u8__after_header(
    new Uint8Array(new Uint16Array(333333).map(
        (v, n_t)=>{
            return Math.sin(n_t*0.1)*n_max_amplitude_default_16_bit
        }
    ).buffer), 
    'simple_sine_wave.wav'
);
document.body.appendChild(
    f_o_el_audio__from_o_file__wav(o_file__wav)
)

```
# read (seconds length) or change the bitrate and other properties
```javascript
console.log(o_file__wav.n_seconds_duration); 
// if we lower the bitrate (samples per second (per channel))
o_file__wav.o_file.n_samples_per_second_per_channel /= 2;
// the wave file will be longer and the pitch of the sine wave lower
console.log(o_file__wav.n_seconds_duration);

document.body.appendChild(
    f_o_el_audio__from_o_file__wav(o_file__wav)
)

```
# `a_n_u8__after_header`: is the audio data and can be updated
```javascript
o_file__wav.o_file.a_n_u8__after_header = new Uint8Array(
    new Uint16Array(
        333
    ).map(
        (v, n_t)=>{return Math.sin(n_t)*n_max_amplitude_default_16_bit}
    ).buffer
)
document.body.appendChild(
    f_o_el_audio__from_o_file__wav(o_file__wav)
)


```
# `f_o_file__wav__from_a_n_u8`: create a wav file from a uint8 array that contains a full .wav file
```javascript
// this is an array containing an actual wav file
//  it beginns the mark       '  R  I  F  F ' 
let a_n_u8__wav_file_complete = [82,73,70,70,190,2,0,0,87,65,86,69,102,109,116,32,16,0,0,0,1,0,1,0,17,43,0,0,34,86,0,0,16,0,16,0,100,97,116,97,154,2,0,0,0,0,180,107,99,116,16,18,34,159,67,133,61,220,23,84,162,126,192,52,94,186,1,128,82,187,199,53,203,126,60,83,39,219,242,132,225,159,47,19,218,116,23,107,222,254,176,147,23,140,16,239,155,97,106,122,172,34,15,171,137,129,73,204,148,70,252,127,184,67,50,201,14,129,161,173,239,37,93,123,95,95,179,235,176,138,137,149,68,2,233,108,109,115,209,15,171,157,236,133,107,222,201,85,73,126,173,50,122,184,9,128,63,189,212,55,21,127,128,81,253,216,87,132,99,161,107,21,194,117,213,105,154,252,127,146,18,141,79,241,14,99,187,121,125,32,96,169,232,129,94,206,117,72,239,127,201,65,40,199,201,128,97,175,23,40,242,123,216,93,119,233,205,137,208,150,135,4,22,110,110,114,144,13,59,156,160,134,156,224,116,87,229,125,150,48,156,182,27,128,48,191,219,57,85,127,189,79,214,214,198,131,238,162,166,23,161,118,138,104,87,250,87,145,22,142,144,243,121,100,3,121,74,30,185,167,80,130,119,208,81,74,216,127,213,63,35,197,142,128,38,177,60,42,126,124,74,92,61,231,243,136,30,152,203,6,57,111,101,113,79,11,212,154,93,135,208,226,24,89,120,125,124,46,196,180,55,128,39,193,222,59,139,127,244,77,178,212,64,131,128,164,223,25,118,119,55,103,20,248,56,144,35,143,210,245,221,101,65,120,22,28,24,166,195,130,147,210,38,76,183,127,220,61,34,195,94,128,242,178,94,44,0,125,180,90,5,229,35,136,117,153,14,9,84,112,83,112,13,9,117,153,35,136,6,229,181,90,0,125,93,44,242,178,94,128,35,195,221,61,183,127,37,76,146,210,195,130,25,166,22,28,66,120,220,101,209,245,34,143,57,144,21,248,56,103,118,119,222,25,127,164,64,131,179,212,245,77,139,127,221,59,38,193,55,128,197,180,125,46,120,125,24,89,207,226,92,135,213,154,80,11,101,113,57,111,202,6,30,152,244,136,62,231,75,92,126,124,60,42,38,177,142,128,35,197,214,63,216,127,80,74,118,208,80,130,186,167,75,30,3,121,121,100,143,243,21,142,88,145,88,250,139,104,161,118,165,23,237,162,199,131,215,214,190,79,85,127,218,57,47,191,27,128,157,182,151,48,229,125,116,87,155,224,159,134,60,156,145,13,110,114,21,110,134,4,207,150,205,137,120,233,217,93,242,123,22,40,96,175,201,128,41,199,202,65,239,127,117,72,93,206,232,129,97,169,126,32,187,121,13,99,78,241,17,141,128,146,155,252,213,105,194,117,106,21,99,161,87,132,254,216,129,81,21,127,211,55,62,189,9,128,123,184,174,50,73,126,201,85,106,222,236,133,171,157,210,15,109,115,233,108,67,2,137,149,177,138,180,235,96,95,92,123,238,37,161,173,15,129,51,201,185,67,252,127,148,70,72,204,137,129,16,171,173,34,106,122,154,97,15,239,23,140,176,147]
o_file__wav = f_o_file__wav__from_a_n_u8(new Uint8Array(a_n_u8__wav_file_complete));

document.body.appendChild(
    f_o_el_audio__from_o_file__wav(o_file__wav)
)


```
# `f_o_file__wav__from_a_n_u8__fetch_from_s_url`: fetch a .wav file from a url and create a o_file__wav
```javascript
// if we have a webserver that hosts .wav files we can directly fetch those into a o_wav__file 
o_file__wav = await f_o_file__wav__from_a_n_u8__fetch_from_s_url('./files/CantinaBand60.wav');

document.body.appendChild(
    f_o_el_audio__from_o_file__wav(o_file__wav)
)


```