大家好，欢迎来到前端研习圈。

## 前言
本期的主题是通过 **OpenAi** 的语言识别模型 **whisper** 来实践一个 **语音转文本** 的功能。

由于技术栈以 **python** 为主，结合受众群体考虑，本期我们主要完成环境部署，实现呢就不手敲了，直接找社区贡献的 **demo** 跑通来演示一下。在开始之前，我们先来大致了解一下 **whisper**。


## whisper 简介
![](http://mmjg.site/imgs/3cf821ce-14c4-439c-a0af-34f9b3c47385.webp)

通过官方简介我们可以知道 **whisper** 是一个通用的，经过大量的音频数据训练出来的支持```多任务```处理的```语言识别，语言翻译``` 模型

可选的 **size** 有 ```tiny, base, small, medium, large```，详细数据如图
![](http://mmjg.site/imgs/33d79c6c-ac98-46d1-b893-45cc538d218c.webp)

下面展示了 **whisper** 支持语言的种类，以及在 **Common Voice 15** 和 **Fleurs** 数据集上使用的 ```WER (单词错误率)或 CER (字符错误率）``` 相关指标
![](http://mmjg.site/imgs/98d824e5-c965-405f-90ba-3c8250d84e8b.webp)


有了以上的了解，那么接下来，我们开始今天的实践~

## 环境安装

众所周知，凡事涉及到```机器学习，模型训练```等相关的领域，基本都是 **python** 技术栈，当然 **whisper** 也不例外。

在安装指南中我们可以了解到，**whisper** 虽然是用的 **python(3.9.9)** 版本 和 **pyTorch(1.10.1)** 版本来训练的，但也能兼容到比较新的版本

![](http://mmjg.site/imgs/a0de0e17-75d2-41bc-820d-3deef8d238d8.webp)

因此我们选择

- ```python``` - **3.11.7** 版本
- ```pyTorch``` - **2.2.1** 版本

为了方面后续灵活切换 **python** 的版本，我们先安装 **python** 的版本管理工具 ```pyenv```

### 安装 pyenv

**Windows** 下，我们需要安装 **pyenv** 的 windows 版本 **pyenv-win**
> ```pyenv``` 安装指南
>
> https://github.com/pyenv-win/pyenv-win/blob/master/docs/installation.md#powershell


![](http://mmjg.site/imgs/3a254f59-13f6-45d1-918a-4539d3f934f3.webp)

这里我们直接选择下载 **zip** 包的方式，下载完成后将 **bin** 的路径配置到 **环境变量** 中即可

![](http://mmjg.site/imgs/35c0486d-7b06-432b-8f82-e24275f7c4b8.webp)

### 安装 python
有了 **pyenv**，我们直接执行如下命令

```
pyenv install 3.11.7
```

然后等待安装完成

![](http://mmjg.site/imgs/d196d21c-7783-49c0-b21f-fe10de6703eb.webp)



### 安装 pyTorch
**pyTorch** 是基于 **python** 的一个 **深度学习** 框架，我们直接到官网去拷贝安装指令即可
> ```pyTorch``` 官网 ```https://pytorch.org/```

![](http://mmjg.site/imgs/35b10ef5-9ff1-4d9d-a3af-b70ef6330b1a.webp)

这里 **pip3** 是 python3 的一个包管理工具，安装 python 时会同步安装。因此我们只需要把 **安装指令** 拷贝到终端执行，然后等待安装完成

```
pip3 install torch torchvision torchaudio --index-url https://download.pytorch.org/whl/cu118
```

### 安装 ffmpeg

**whisper** 在处理音频文件时会用到 **ffmpeg**，这里也需要安装一下。我们直接到 **github** 中去下载 **ffmpeg** 最新版本的构建产物

> https://github.com/BtbN/FFmpeg-Builds/releases

![](http://mmjg.site/imgs/bd19e344-7ecc-4424-91be-937302177aab.webp)

同样，下载完成后将 ```bin``` 目录配置到 **环境变量** 中即可

![](http://mmjg.site/imgs/1e07aa31-14ff-42f8-baa2-3295e86b7326.webp)

之后在终端确认一下是否安装成功

![](http://mmjg.site/imgs/a8a8d82e-e161-4031-9d97-daf5c38a0391.webp)

OK，到这里，需要的环境我们就全部安装好啦

## DEMO
我们直接从社区提供的 ```demo``` 找一个比较具有代表性的来跑一下

> https://github.com/gustavostz/whisper-clip

先把这个仓库 ```fork``` 一下，```clone``` 到我们本地
```
git clone git@github.com:Mumujianguang/whisper-clip.git
```

然后就是传统的```依赖安装```环节

```
pip3 install -r requirements.txt
```

源码中默认用的是仅支持英文的 ```medium.en``` 模型，这里我们改成支持多语言的 ```medium``` 模型

![](http://mmjg.site/imgs/792651e0-4650-4cd1-9313-6199e3f39ab3.webp)

接下来就可以把程序跑起来了
```
python main.py
```

在启动程序之前，会先将模型下载下来，这里可以看到需要下载 ```1.42G``` 的内容
![](http://mmjg.site/imgs/ace5b97a-86d7-4a5f-8789-2a10d28c2c2a.webp)

程序跑起来之后会运行一个弹窗面板，功能大致如下
- 点击后开始录音，再次点击结束录音
- 这段录音会落盘生成一个 **wav** 的音频文件
- 随后交给 **whisper** 去识别输出音频中的内容

接下来我们说一句 **吃饭没 我想吃蛋炒饭**，结束录音后大概 **1-2s**，终端就输出了识别结果，丝毫不差，在此感叹一句 AI 的强大~

![](http://mmjg.site/imgs/26e8d49c-1e62-463e-8bbf-e8597a7cf033.webp)

接着我再多说几句
- 大家好，欢迎来到前端研习圈
- 大家好，我是陆星材，请多多关心吧！

![](http://mmjg.site/imgs/0e701349-1e55-4a30-9e6a-9e93b1745f1c.webp)

虽然有些字不准确，但发音都识别对了，这也还只是个```中等模型```，还是很不错了



## 写在最后
对于前端的同学来说，看完是不是觉得 ```AI``` 也并非遥不可及，未来类似基于 ```大模型``` 的库会越来越多，希望大家时刻关注前沿技术的发展，能早日将 ```AI``` 应用到自己的工作与生活中

这期就到这里，我们下期见~