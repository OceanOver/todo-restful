const engine = require('store/src/store-engine')
const storages = [require('store/storages/cookieStorage')]
const localStorages = [require('store/storages/localStorage')]
const plugins = [require('store/plugins/expire')]
const store = engine.createStore(storages, plugins)
const localStore = engine.createStore(localStorages, plugins)

exports.store = store
exports.localStore = localStore

/**
 * 保存数据
 * expire 过期时间（ms）
 */
exports.es_save = (key, value, expire) => {
    if (expire) {
        store.set(key, value, new Date().getTime() + expire)
    } else {
        store.set(key, value)
    }
}

/**
 * 获取值
 * @param key
 */
exports.es_get = key => {
    return store.get(key)
}

/**
 * 删除数据
 */
exports.es_remove = key => {
    store.remove(key)
}

/**
 * 删除所有
 */
exports.es_clearAll = () => {
    store.clearAll()
}

//########localStore###########
/**
 * 保存数据
 * expire 过期时间（ms）
 */
exports.local_save = (key, value, expire) => {
    if (expire) {
        localStore.set(key, value, new Date().getTime() + expire)
    } else {
        localStore.set(key, value)
    }
}

/**
 * 获取值
 * @param key
 */
exports.local_get = key => {
    return localStore.get(key)
}

/**
 * 删除数据
 */
exports.local_remove = key => {
    localStore.remove(key)
}

/**
 * 删除所有
 */
exports.local_clearAll = () => {
    localStore.clearAll()
}
