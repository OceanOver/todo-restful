'use strict'

module.exports = app => {
  const { controller: { item }, middleware } = app
  const authRequired = middleware.authRequired(app)
  const router = app.router.namespace('/api/item', authRequired)

  router.get('/list', item.list)
  router.get('/statistics', item.statistics)
  router.post('/addItem', item.addItem)
  router.post('/modifyItem', item.modifyItem)
  router.post('/clearAll', item.clearAll)
  router.delete('/deleteComplete', item.deleteComplete)
  router.post('/deleteItems', item.deleteItems)
  router.delete('/deleteItem/:id', item.deleteItem)
  router.post('/completeItem', item.completeItem)
  router.delete('/deleteExpire', item.deleteExpire)
}
