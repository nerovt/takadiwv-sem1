
import Router from 'koa-router'

const router = new Router({ prefix: '/auc' })

async function checkAuth(ctx, next) {
	console.log('secure router middleware')
	console.log(ctx.hbs)
	if(ctx.hbs.authorised !== true) return ctx.redirect('/login?msg=you need to log in&referrer=/auc')
	await next()
}

router.use(checkAuth)
import Accounts from '../modules/accounts.js'
import Items from '../modules/items.js'
const dbName = 'website.db'

function modifyResults(results, ctx) {
	const items = []
	for(const i of results) {
		if(String(i.seller) === String(ctx.session.username)) {
			items.push(i)
		}
	}
	for(let i of items) {
		i = {id: i.id, item: i.item, image: i.image, status: i.status}
	}
	return items
}

/**
 * The secure page.
 *
 * @name Auction Page
 * @route {GET} /
 */
router.get('/', async ctx => {
	const account = await new Accounts(dbName)
	const items = await new Items(dbName)
	try {
		let results = await items.getDetails() ; ctx.hbs.record = {}
		results = modifyResults(results, ctx) //call function to modify
		if(results.length !== 0) {
			ctx.hbs.record.status = true ; ctx.hbs.record.data = [] ; ctx.hbs.record.data = results
		} else ctx.hbs.record.status = false
		await ctx.render('auc', ctx.hbs)
	} catch(err) {
		await ctx.render('error', ctx.hbs)
	}
	account.close() ; items.close()
})

router.post('/', async ctx => {
	const items = await new Items(dbName)
	await items.deleteItem(Number(ctx.request.body.id))
	ctx.redirect('/auc')
})

export default router
