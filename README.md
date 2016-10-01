# Knowlead WebClient Repo

## HTTP Status Codes

### For 4xx and 5xx status codes

**The "Key" describes the possition of the error message**  
**The "Value" describes the error message it self**

[![Screen Shot 2016-10-01](https://s12.postimg.org/hdf5dx7d9/Screen_Shot_2016_10_01_at_01_38_00.png)](https://postimg.org/image/vjuw95i89/)

* If key matches some of element in the form, put the error message above that element
* If no element is named as the given key, then put the error message above/below the whole form    
      -
* If value (Error Code) matches one from our translations dictionary, use the value from that dictionary
* If no match is found in the dictionary for given value, use the value (raw) as it is to display the error message

### For 1xx and 2xx status codes

**Just expect an object with properites**

### 3xx are just Redirects



