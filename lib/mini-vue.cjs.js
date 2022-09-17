'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

function initProps(instance, rawProps) {
    if (rawProps === void 0) { rawProps = {}; }
    instance.props = rawProps;
    // TODO attrs
}

var extend = Object.assign;
var isObject = function (val) {
    return val !== null && typeof val === 'object';
};
var hasOwn = function (val, key) { return Object.prototype.hasOwnProperty.call(val, key); };

var publicPropertiesMap = {
    $el: function (instance) { return instance.vnode.el; },
};
var PublicInstanceProxyHandlers = {
    get: function (_a, key) {
        var instance = _a._;
        // 从setupState获取值
        var setupState = instance.setupState, props = instance.props;
        // if (key in setupState) {
        //   return setupState[key]
        // } else if (key in props) {
        //   return props[key]
        // }
        // refactor
        if (hasOwn(setupState, key)) {
            return setupState[key];
        }
        else if (hasOwn(props, key)) {
            return props[key];
        }
        // if (key === '$el') {
        //   return instance.vnode.el
        // }
        var publicGetter = publicPropertiesMap[key];
        if (publicGetter) {
            return publicGetter(instance);
        }
    },
};

var targetMap = new Map();
function trigger(target, key) {
    var depsMap = targetMap.get(target);
    var dep = depsMap.get(key);
    triggerEffect(dep);
}
function triggerEffect(dep) {
    for (var _i = 0, dep_1 = dep; _i < dep_1.length; _i++) {
        var effect_1 = dep_1[_i];
        // 调度器 scheduler 
        if (effect_1.scheduler) {
            effect_1.scheduler();
        }
        else {
            effect_1.run();
        }
    }
}

var createGetter = function (isReadonly, shallow) {
    if (isReadonly === void 0) { isReadonly = false; }
    if (shallow === void 0) { shallow = false; }
    return function (target, key) {
        if (key === "__v_isReactive" /* IS_REACTIVE */) {
            return !isReadonly;
        }
        else if (key === "__v_isReadonly" /* IS_READONLY */) {
            return !!isReadonly;
        }
        var res = Reflect.get(target, key);
        // shallowReadonly
        if (shallow) {
            return res;
        }
        // 解决嵌套对象深层reactive和readonly
        if (isObject(res)) {
            return isReadonly ? readonly(res) : reactive(res);
        }
        return res;
    };
};
var createSetter = function () { return function (target, key, value) {
    var res = Reflect.set(target, key, value);
    trigger(target, key);
    return res;
}; };
// cache
var get = createGetter();
var set = createSetter();
var readonlyGet = createGetter(true);
var shallowReadonlyGet = createGetter(true, true);
var mutableHandlers = {
    get: get,
    set: set
};
var readonlyHandlers = {
    get: readonlyGet,
    set: function (target, key, value) {
        console.warn('readonly cannot set value');
        return true;
    }
};
var shallowReadonlyHandlers = extend({}, readonlyHandlers, {
    get: shallowReadonlyGet
});

var createActiveObject = function (target, baseHandlers) {
    if (!isObject(target)) {
        console.warn("target ".concat(target, " must be object"));
        return target;
    }
    return new Proxy(target, baseHandlers);
};
// 存储依赖
var reactive = function (raw) {
    return createActiveObject(raw, mutableHandlers);
};
var readonly = function (raw) {
    return createActiveObject(raw, readonlyHandlers);
};
var shallowReadonly = function (raw) {
    return createActiveObject(raw, shallowReadonlyHandlers);
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
    initProps(instance, instance.vnode.props);
    // initSLots()
    // 初始化component （设置有状态的组件， 除了有状态的组件还有函数组件 无状态）
    setupStatefulComponent(instance);
}
function setupStatefulComponent(instance) {
    // 获取用户给到的配置 就是传入的type 实际为App
    // const Component = instance.vnode.type
    var Component = instance.type;
    // TODO 实现组件代理对象 这里不是很理解 复习的时候！！！得再看看
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
        // 将props传入setup,然后去Proxy中作处理
        var setupResult = setup(shallowReadonly(instance.props));
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
    // createApp时拿到的就是APP
    var Component = instance.type;
    // if (Component.render) {
    instance.render = Component.render;
    // } 
}

/**
 *
 * @param vnode 虚拟节点
 * @param container 容器
 */
function render(vnode, container) {
    // patch
    patch(vnode, container);
}
function patch(vnode, container) {
    // shapeFlags 标识虚拟节点有哪几种flag
    // vnode -> flag
    // element  componet: STATEFUL_COMPONENT  children: text_children array_children
    // 处理组件
    // 如何区分是element类型还是component类型? vnode.type
    // element类型的type是string，component类型是对象
    // if (typeof vnode.type === 'string') {
    //   processElement(vnode, container)
    // } else if (isObject(vnode.type)) {
    //   processComponent(vnode, container)
    // }
    // 以上内容更新为ShapeFlags判断
    var shapeFlags = vnode.shapeFlags;
    if (shapeFlags & 1 /* ELEMENT */) {
        processElement(vnode, container);
    }
    else if (shapeFlags & 2 /* STATEFUL_COMPONENT */) {
        processComponent(vnode, container);
    }
}
function processElement(vnode, container) {
    // mount
    mountElement(vnode, container);
    // update
}
function processComponent(vnode, container) {
    mountComponent(vnode, container);
}
// 创建element
function mountElement(vnode, container) {
    var el = (vnode.el = document.createElement(vnode.type));
    var children = vnode.children, props = vnode.props, shapeFlags = vnode.shapeFlags;
    // children: string array
    // if (typeof children === 'string') {
    //   el.textContent = children
    // } else if (Array.isArray(children)) {
    //   // vnode 遍历children 拿到每一个vnode，然后执行patch
    //   // children.forEach(v => {
    //   //   patch(v, el)
    //   // })
    //   mountChildren(vnode, el)
    // }
    // 以上改为ShapeFlags判断
    if (shapeFlags & 4 /* TEXT_CHILDREN */) {
        el.textContent = children;
    }
    else if (shapeFlags & 8 /* ARRAY_CHILDREN */) {
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
            // const isOn = (key: string): boolean => key.startsWith('on')
            var isOn = function (key) { return /^on[A-z]/.test(key); };
            if (isOn(key)) {
                var event_1 = key.slice(2).toLowerCase();
                el.addEventListener(event_1, props[key]);
            }
            el.setAttribute(key, props[key]);
        }
    }
    container.append(el);
}
// 创建component  initialVNode初始化vnode
function mountComponent(initialVNode, container) {
    var instance = createComponentInstance(initialVNode);
    setupComponent(instance);
    SetupRenderEffectFn(instance, initialVNode, container);
}
function mountChildren(vnode, container) {
    vnode.children.forEach(function (v) {
        patch(v, container);
    });
}
function SetupRenderEffectFn(instance, initialVNode, container) {
    var proxy = instance.proxy;
    // vnode
    // const subTree = instance.render()
    // instance.render方法时在finishComponentSetup()时挂上来的
    var subTree = instance.render.call(proxy);
    // 根据返回的虚拟节点 进步patch vnode -> patch
    // vnode -> 现在是element类型 ->下一步应该 mountElement 挂载element
    // mountElement 在patch里做
    patch(subTree, container);
    // 此时mount完
    initialVNode.el = subTree.el;
}

/**
 * @params type: 元素 组件
 */
function createVNode(type, props, children) {
    var vnode = {
        type: type,
        props: props,
        children: children,
        shapeFlags: getShapeFlags(type),
        el: null
    };
    // children 
    if (typeof children === 'string') {
        // 通过｜ 或运算符进行改变
        // vnode.shapeFlags = vnode.shapeFlags | ShapeFlags.TEXT_CHILDREN
        vnode.shapeFlags |= 4 /* TEXT_CHILDREN */;
    }
    else if (Array.isArray(children)) {
        vnode.shapeFlags |= 8 /* ARRAY_CHILDREN */;
    }
    return vnode;
}
function getShapeFlags(type) {
    return typeof type === 'string'
        ? 1 /* ELEMENT */
        : 2 /* STATEFUL_COMPONENT */;
}

// 接收根组件 返回对象
function createApp(rootComponent) {
    // debugger
    return {
        // 接收一个element实例 根容器 一般就是id为app的根
        mount: function (rootContainer) {
            // 先转换成vnode 虚拟节点
            // components => vnode
            // 所有操作都基于vnode
            // 传入APP组件实例
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
