### 异步编程的局限性 ###
我们之前已经讨论过异步编程，何时应该使用它。

异步编程通过在事件循环中“调度”要稍后执行的部分代码来使应用程序UI能够响应，从而允许首先执行UI渲染。

异步编程的一个很好的用例是制作AJAX请求。 由于请求可能需要很长时间，因此可以异步制作请求，并且在客户端等待响应时，可以执行其他代码。
```
// This is assuming that you're using jQuery
jQuery.ajax({
    url: 'https://api.example.com/endpoint',
    success: function(response) {
        // Code to be executed when a response arrives.
    }
});
```
但是，这会带来一个问题 - 请求由浏览器的WEB API处理，但其他代码如何可以异步？ 例如，如果成功回调中的代码是CPU密集型的：
```
var result = performCPUIntensiveCalculation();
```
如果performCPUIntensiveCalculation不是一个HTTP请求，而是一个阻止代码（例如一个巨大的for循环），则无法释放事件循环并解除浏览器的用户界面 - 它会冻结并对用户无响应。

这意味着异步函数仅解决JavaScript语言的单线程局限性的一小部分。

在某些情况下，通过使用setTimeout，您可以在从更长时间运行的计算中解除UI的情况下取得良好结果。 例如，通过在独立的setTimeout调用中对复杂的计算进行批处理，您可以将它们置于事件循环中的单独“位置”，这样就可以获得UI渲染/响应性所需的时间。

我们来看看一个计算数值数组平均值的简单函数：
```
function average(numbers) {
    var len = numbers.length,
        sum = 0,
        i;

    if (len === 0) {
        return 0;
    } 
    
    for (i = 0; i < len; i++) {
        sum += numbers[i];
    }
   
    return sum / len;
}
```
这就是你如何重写上面的代码并“模拟”异步性：
```
function averageAsync(numbers, callback) {
    var len = numbers.length,
        sum = 0;

    if (len === 0) {
        return 0;
    } 

    function calculateSumAsync(i) {
        if (i < len) {
            // Put the next function call on the event loop.
            setTimeout(function() {
                sum += numbers[i];
                calculateSumAsync(i + 1);
            }, 0);
        } else {
            // The end of the array is reached so we're invoking the callback.
            callback(sum / len);
        }
    }

    calculateSumAsync(0);
}
```
这将使用setTimeout函数，该函数将在事件循环的更下方添加计算的每个步骤。 在每次计算之间，将有足够的时间进行其他计算，这是解冻浏览器所必需的。

### WebWorks的救赎
HTML5给我们带来了很多很棒的东西，包括：

- SSE（我们已经在之前的文章中描述并与WebSockets进行了比较）
- 地理位置
- 应用程序缓存
- 本地存储
- 拖放
- WebWorker

Web Workers是浏览器内的线程，可用于执行JavaScript代码而不会阻止事件循环。

这真是太神奇了。 JavaScript的整个范例基于单线程环境的思想，但在这里来自网络工作者（Web Workers），它解除了（部分）这种限制。

Web Workers允许开发人员将长时间运行和计算密集型任务放在后台，而不会阻止用户界面，从而使您的应用程序更具响应能力。更重要的是，为了解决事件循环的问题，不需要使用setTimeout技巧。

下面是一个简单的演示，显示了在有和没有Web Workers的情况下对数组进行排序的区别。

Web工作者概述
Web Workers允许您执行诸如启动长时间运行的脚本来处理计算密集型任务，但不会阻止UI。实际上，这一切都是平行进行的。 Web Workers真正是多线程的。

你可能会说 - “JavaScript不是单线程语言吗？”。

当你意识到JavaScript是一种没有定义线程模型的语言时，这应该是你的'aha！'时刻。 Web Workers不是JavaScript的一部分，它们是可以通过JavaScript访问的浏览器功能。大多数浏览器历来都是单线程的（当然，这已经改变了），并且大多数JavaScript实现都发生在浏览器中。 Web工作人员没有在Node.JS中实现 - 它有一个“cluster”或“child_process”的概念，有点不同。

值得注意的是，这个规范提到了三种类型的Web Workers：

- Dedicated Workers()
- Shared Workders()
- Service workders

### 专用工人 ###
专用Web Worker由主进程实例化，并且只能与其进行通信。

### 共享工作者 ###
共享工作人员可以通过运行在同一来源的所有进程（不同的浏览器选项卡，iframe或其他共享工作人员）访问。

### 服务工作者 ###
服务工作人员是一个事件驱动的工作人员，针对原点和路径进行了注册。 它可以控制与之关联的网页/网站，拦截并修改导航和资源请求，并以非常细化的方式缓存资源，从而使您可以很好地控制应用在某些情况下的行为方式（例如，当网络不是可用。）

在这篇文章中，我们将关注Dedicated Workers(专职工作者)并将他们称为“(Web Workders)网络工作者”或“(Workers)工作者”。

### Web Workders 如何工作 ###
Web Workers被实现为.js文件，这些文件通过页面中的异步HTTP请求提供。 Web Worker API完全隐藏了这些请求。

工作人员利用类似线程的消息传递来实现并行性。 它们非常适合保持您的用户界面的最新性，性能和响应能力。

Web工作人员在浏览器中的独立线程中运行。 因此，它们执行的代码需要包含在单独的文件中。 记住这一点非常重要。

让我们看看如何创建一个基本的工作人员：
```
var worker = new Worker('task.js');
```
如果“task.js”文件存在且可访问，浏览器将产生一个新的线程，以异步方式下载文件。 下载完成后，它将被执行，工作人员将开始工作。
如果提供的文件路径返回404，工作人员将自动失败。

为了启动创建的worker，你需要调用postMessage方法：
```
worker.postMessage();
```
### 网络工作者通信 ###
为了在Web Worker和创建它的页面之间进行通信，您需要使用postMessage方法或广播频道。

### postMessage方法 ###
较新的浏览器支持将JSON对象作为该方法的第一个参数，而旧版浏览器只支持一个字符串。

让我们看一个创建worker的页面如何与它进行通信的例子，通过传递一个JSON对象作为一个更“复杂”的例子。 传递一个字符串是完全一样的。

我们来看看下面的HTML页面（或者更精确一些）：
```
<button onclick="startComputation()">Start computation</button>

<script>
  function startComputation() {
    worker.postMessage({'cmd': 'average', 'data': [1, 2, 3, 4]});
  }
  var worker = new Worker('doWork.js');
  worker.addEventListener('message', function(e) {
    console.log(e.data);
  }, false);
  
</script>
```
这就是我们的工作人员脚本的外观：
```
self.addEventListener('message', function(e) {
  var data = e.data;
  switch (data.cmd) {
    case 'average':
      var result = calculateAverage(data); // Some function that calculates the average from the numeric array.
      self.postMessage(result);
      break;
    default:
      self.postMessage('Unknown command');
  }
}, false);
```
点击按钮后，将从主页面调用postMessage。 worker.postMessage行将JSON对象传递给worker，并添加cmd和数据键及其各自的值。 工作人员将通过定义的消息处理程序处理该消息。

当消息到达时，实际的计算正在工作者中执行，而不会阻塞事件循环。 工作人员正在检查传递的事件e并执行，就像标准的JavaScript函数一样。 完成后，结果会传回主页面。

在一名工人的背景下，自我和这一点都指向了工人的全球范围。

有两种方法可以阻止工作人员：通过从主页面调用worker.terminate（）或在worker本身内部调用self.close（）。

### 广播频道 ###
广播频道是更通用的通信API。 它允许我们将消息广播到共享相同来源的所有上下文。 所有浏览器选项卡，iframe或从同一来源提供服务的工作人员都可以发送和接收消息：
```
// Connection to a broadcast channel
var bc = new BroadcastChannel('test_channel');

// Example of sending of a simple message
bc.postMessage('This is a test message.');

// Example of a simple event handler that only
// logs the message to the console
bc.onmessage = function (e) { 
  console.log(e.data); 
}

// Disconnect the channel
bc.close()
```
在视觉上，你可以看到广播频道的样子，使其更加清晰：

虽然广播频道的浏览器支持有限，

### 消息的大小 ###
有两种方式将消息发送给Web Workers：

- 复制消息：消息被序列化，复制，发送，然后在另一端解除序列化。页面和工作人员不共享同一个实例，所以最终结果是每次传递都会创建一个副本。大多数浏览器通过自动JSON编码/解码任何一端的值来实现此功能。正如所料，这些数据操作为消息传输增加了大量的开销。信息越大，发送时间越长。
- 转发邮件：这意味着原始发件人在发送后不能再使用它。传输数据几乎是瞬间的。限制是只有ArrayBuffer可以转让。

### Web Workers可用的功能 ###
由于Web Worker的多线程特性，Web Worker只能访问JavaScript特性的一个子集。以下是功能列表：

- navigator对象
- 位置对象（只读）
- XMLHttpRequest
- setTimeout（）/ clearTimeout（）和setInterval（）/ clearInterval（）
- 应用程序缓存
- 使用importScripts（）导入外部脚本
- 创建其他Web Workers

### Web Worker限制 ###
可悲的是，Web Workers没有访问一些非常关键的JavaScript特性：

- DOM（它不是线程安全的）
- 窗口对象
- 文档对象
- 父对象
这意味着Web Worker不能操纵DOM（以及UI）。它有时可能会非常棘手，但是一旦您学会如何正确使用Web Workers，您将开始将它们作为单独的“计算机”使用，而所有UI更改将发生在您的页面代码中。工作人员将为您完成所有繁重的工作，一旦工作完成，您会将结果传递给对UI进行必要更改的页面。

### 处理错误 ###
与任何JavaScript代码一样，您需要处理在Web Workers中引发的任何错误。如果在执行工作时发生错误，则会触发ErrorEvent。该接口包含三个有用的属性，用于确定出错的地方：

- filename - 导致错误的工作者脚本的名称
- lineno - 发生错误的行号
- 消息 - 错误的描述
这是一个例子：
```
function onError(e) {
  console.log('Line: ' + e.lineno);
  console.log('In: ' + e.filename);
  console.log('Message: ' + e.message);
}

var worker = new Worker('workerWithError.js');
worker.addEventListener('error', onError, false);
worker.postMessage(); // Start worker without a message.
```
```
self.addEventListener('message', function(e) {
  postMessage(x * 2); // Intentional error. 'x' is not defined.
};
```
在这里，您可以看到我们创建了一geWorker并开始监听错误事件。

在worker的内部（在workerWithError.js中），我们通过将x乘以2来创建一个有意的异常，而未在该范围中定义x。 异常传播到初始脚本，并且正在调用有关错误信息的onError。

### Web Workers的应用方向 ###
到目前为止，我们列出了Web Workers的优势和局限性。现在让我们看看对他们来说最强的用例是什么：

- 光线追踪：光线追踪是一种通过将光线追踪为像素来生成图像的渲染技术。光线追踪使用CPU密集型数学计算来模拟光线路径。这个想法是模拟反射，折射，材质等一些效果。所有这些计算逻辑都可以添加到Web Worker中以避免阻塞UI线程。更好的是 - 您可以轻松地将几个工作人员（以及多个CPU之间）之间的图像渲染分开。这里是使用Web Workers进行光线追踪的简单演示 - https://nerget.com/rayjs-mt/rayjs.html。
- 加密：由于对个人和敏感数据的监管日益严格，端到端加密越来越受欢迎。加密可能是一件非常耗时的事情，特别是如果有很多数据必须经常加密（例如在将数据发送到服务器之前）。这是一个非常好的场景，可以使用Web Worker，因为它不需要访问DOM或任何想象的东西 - 这是纯粹的算法来完成他们的工作。一旦进入工作人员，它对最终用户而言是无缝的，并且不会影响他们的体验。
- 预取数据：为了优化您的网站或Web应用程序并缩短数据加载时间，您可以利用Web Workers预先加载和存储一些数据，以便稍后在需要时使用它。在这种情况下，Web Workers是惊人的，因为它们不会影响您的应用的用户界面，而不像工作时没有工作人员那样。
- 渐进式Web应用程序：即使网络连接不稳定，它们也必须快速加载。这意味着数据必须存储在本地浏览器中。这是IndexDB或类似的API进场的地方。基本上，需要客户端存储。为了在不阻塞UI线程的情况下使用，工作必须在Web Workers中完成。那么，就IndexDB而言，有一个异步API，即使没有工作人员也可以执行此操作，但之前有一个同步API（可能会再次引入），只能在工作人员中使用。
- 拼写检查：基本拼写检查程序按以下方式工作 - 程序读取带有拼写正确单词列表的字典文件。正在将字典解析为搜索树以使实际的文本搜索效率更高。当一个单词被提供给检查器时，程序检查它是否存在于预先构建的搜索树中。如果在树中没有找到该单词，则可以通过替代字符并测试它是否是有效的单词 - 如果它是用户想要写的单词来为用户提供替代拼写。所有这些处理都可以轻松卸载到Web Worker中，以便用户可以在没有任何UI阻塞的情况下键入单词和句子，而工作人员则执行所有搜索和提供建议。
