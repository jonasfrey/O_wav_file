# O_wav_file
## import 
```javascript
var o_wav_file = await f_o_wav_file("./ImperialMarch60.wav");
var f_create_png = async function(
    n_scale_x, 
    n_scale_y, 
    a_n__data, 
    s_path_file
){
    var n_max_val = Math.pow(2,a_n__data.BYTES_PER_ELEMENT*8)-1;
    var n_max_val_signed = n_max_val / 2;
    
    var n_min_val_signed = -(n_max_val / 2);
    var n_samples = a_n__data.length;

    var n_channels = 4;
    // An array containing a RGBA sequence where the first pixel is red and second is black
    const a_n_u8 = new Uint8Array(n_scale_x*n_scale_y*n_channels);
    var n_i_channel = 0;
    var n_x = 0;
    var n_y = 0;
    var n_samples_per_y = n_samples / n_scale_y;
    var n_samples_per_x = n_samples / n_scale_x;
    var n_scale_x_per_sample_val = n_scale_x / n_max_val_signed;

    while(n_i_channel < a_n_u8.length){
        n_x = (n_i_channel / n_channels) % n_scale_x;
        n_y = parseInt((n_i_channel / n_channels) / n_scale_x );
        var n_sample_val = a_n__data[parseInt(n_samples_per_x*n_x)];
        var n_y_normalized = (n_y / n_scale_y);
        var n_sample_normalized = (n_sample_val / n_max_val);
        var n_amp = 2.0;
        var n_sample_normalized_mod = n_sample_normalized*n_amp;
        var n_y_normalized_mod = (n_y_normalized - 0.5);
        // console.log(n_y_normalized)
        if(
            n_sample_normalized_mod >= n_y_normalized_mod
        ){
            a_n_u8[n_i_channel+0] = 255;
            a_n_u8[n_i_channel+1] = 255;
            a_n_u8[n_i_channel+2] = 255;
            a_n_u8[n_i_channel+3] = 255;
        }
        if(n_y_normalized_mod == 0.0){
            a_n_u8[n_i_channel+0] = 255;
            a_n_u8[n_i_channel+1] = 0;
            a_n_u8[n_i_channel+2] = 0;
            a_n_u8[n_i_channel+3] = 255;
        }

        a_n_u8[n_i_channel+3] = 255;

        n_i_channel+=n_channels;
    }
    // Encode the image to have width 2 and height 1 pixel
    const o_png = f_o_png_encode(a_n_u8, n_scale_x, n_scale_y);
    await Deno.writeFile(s_path_file, o_png);

}
```
