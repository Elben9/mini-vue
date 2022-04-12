'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

var publicPropertiesMap = {
    $el: function (instance) { return instance.vnode.el; },
};
var PublicInstanceProxyHandlers = {
    get: function (_a, key) {
        var instance = _a._;
        // 从setupState获取值
        var setupState = instance.setupState;
        if (key in setupState) {
            return setupState[key];
        }
        // if (key === '$el') {
        //   return instance.vnode.el
        // }
        var publicGeeter = publicPropertiesMap[key];
        if (publicGeeter) {
            return publicGeeter(instance);
        }
    },
};

function createComponentInstance(vnode) {
    var component = {
        vnode: vnode,
        type: vnode.type,
        setupState: {}
    };
    return component;
}
function setupComponent(instance) {
    // TODO
    // initProps()
    // initSLots()
    // 初始化component
    setupStatefulComponent(instance);
}
function setupStatefulComponent(instance) {
    // 获取用户给到的配置 就是传入的type 实际为App
    var Component = instance.type;
    // 实现组件代理对象
    instance.proxy = new Proxy({
        _: instance
    }, PublicInstanceProxyHandlers
    // 抽离出去,因为以后不光有$el,可能还有$其他的
    // {
    // get (target, key) {
    //   // 从setupState获取值
    //   const { setupState } = instance
    //   if (key in setupState) { 
    //     return setupState[key]
    //   }
    //   if (key === '$el') {
    //     return instance.vnode.el
    //   }
    // },
    // }
    );
    // 拿到setup
    var setup = Component.setup;
    if (setup) {
        // 如果有setup 执行，可能返回function object
        // 如果是function 认为返回的是render函数
        // 如果是object 放在实例上
        var setupResult = setup();
        handleSetupResult(instance, setupResult);
    }
}
function handleSetupResult(instance, setupResult) {
    // TODO function
    if (typeof setupResult === 'object') {
        instance.setupState = setupResult;
    }
    finishComponentSetup(instance);
}
function finishComponentSetup(instance) {
    var Component = instance.type;
    // if (Component.render) {
    instance.render = Component.render;
    // } 
}

var isObject = function (val) {
    return val !== null && typeof val === 'object';
};

function render(vnode, container) {
    // patch
    patch(vnode, container);
}
function patch(vnode, container) {
    // 处理组件
    // TODO 判断vnode是否element类型?
    // 如何区分是element类型还是component类型
    console.log(vnode.type, '查看element类型');
    // element类型的type是string，component类型是对象
    if (typeof vnode.type === 'string') {
        processElement(vnode, container);
    }
    else if (isObject(vnode.type)) {
        processComponent(vnode, container);
    }
}
function processElement(vnode, container) {
    // mount
    mountElement(vnode, container);
    // update
}
function processComponent(vnode, container) {
    mounteComponent(vnode, container);
}
// 创建element
function mountElement(vnode, container) {
    var el = (vnode.el = document.createElement(vnode.type));
    var children = vnode.children, props = vnode.props;
    // children: string array
    if (typeof children === 'string') {
        el.textContent = children;
    }
    else if (Array.isArray(children)) {
        // vnode 遍历children 拿到每一个vnode，然后执行patch
        // children.forEach(v => {
        //   patch(v, el)
        // })
        mountChildren(vnode, el);
    }
    for (var key in props) {
        if (Array.isArray(props[key])) {
            var value = props[key].reduce(function (prev, curr) {
                return prev + ' ' + curr;
            });
            el.setAttribute(key, value);
        }
        else {
            el.setAttribute(key, props[key]);
        }
    }
    container.append(el);
}
// 创建component  initinalVNode初始化vnode
function mounteComponent(initinalVNode, container) {
    var instance = createComponentInstance(initinalVNode);
    setupComponent(instance);
    SetupRenderEffectFn(instance, initinalVNode, container);
}
function mountChildren(vnode, container) {
    vnode.children.forEach(function (v) {
        patch(v, container);
    });
}
function SetupRenderEffectFn(instance, initinalVNode, container) {
    var proxy = instance.proxy;
    // vnode
    // const subTree = instance.render()
    var subTree = instance.render.call(proxy);
    // vnode -> patch
    // vnode -> 现在上element类型 -> mountElement 挂载element
    // mountElement 在patch里做
    patch(subTree, container);
    // 此时mount完
    initinalVNode.el = subTree.el;
}

function createVNode(type, props, children) {
    var vnode = {
        type: type,
        props: props,
        children: children,
        el: null
    };
    return vnode;
}

// 接收根组件 返回对象
function createApp(rootComponent) {
    // debugger
    return {
        // 接收一个element实例 根容器
        mount: function (rootContainer) {
            // 先转换成vnode 虚拟节点
            // components => vnode
            // 所有操作都基于vnode
            var vnode = createVNode(rootComponent);
            render(vnode, rootContainer);
        }
    };
}

function h(type, props, children) {
    return createVNode(type, props, children);
}

exports.createApp = createApp;
exports.h = h;
