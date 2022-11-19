# O_wav_file
## import
```javascript
import { O_wav_file } from "./O_wav_file.module.js";
```
 ## read/open file
```javascript
var o_wav_file = new O_wav_file();
var s_path_file = "./wav_files/ImperialMarch60.wav"
var s_path_file = "./wav_files/wav5196.wav"
var s_path_file = "./wav_files/classical.wav"
var b_slower_but_convinient = true;
await o_wav_file.f_read_file(s_path_file, b_slower_but_convinient);
```
 ## change data
 for example: mute one channel
 if we know that it is a stereo file and we just want to change the right channel for example
```javascript
var n_left = 0;
var n_right = 1;
var n_i_channel = n_right;
for(var n_i_sample = 0; n_i_sample < o_wav_file.a_a_n_sample__channels[n_i_channel].length; n_i_sample+=1){
    o_wav_file.a_a_n_sample__channels[n_i_channel][n_i_sample] = 0;
} 
o_wav_file.f_write_file(s_path_file.split(".").slice(0, -1).join('.')+('_out.wav'));
```
