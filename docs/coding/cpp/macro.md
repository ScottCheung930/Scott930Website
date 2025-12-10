# 宏

常用的宏:

- ```__FILE__``` 文件名
- ```__LINE__``` 行号
- ```__FUNSIG__``` 函数签名(MSVC)
- ```__PRETTY_FUNCTION__``` 函数签名(Clang/gcc)
- ```__func__``` 函数名

## 宏函数
- 打印日志
``` c++
#define LOG(_logInfo, _logLevel) logWrite(_logInfo, _logLevel, __FILE__, __LINE__);

enum class LogLevel {
    DEBUG, 
    INFO,
    ERROR,
    FATAL
};

void logWrite(string logInfo, LogLevel logLevel, string fileName, int line){
    ... ...
}

int main(){

... ...
LOG("test infomation", LogLevel::DEBUG);
... ...

}
```
此处必须使用宏定义函数```LOG```的原因是, ```__LINE__```是该宏所在的行的行数, 若把```__LINE__```写在```logWrite```函数里, 则输出的永远是```logWrite```函数体内有```__LINE__```所在的行号, 而不是```logWrite```函数调用处的行号.
