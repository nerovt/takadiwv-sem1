
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
		let results = await items.getDetails()
		results = modifyResults(results, ctx) //call function to modify
		ctx.hbs.record = [] ; ctx.hbs.record = results
		await ctx.render('auc', ctx.hbs)
	} catch(err) {
		console.log(err.message)
		await ctx.render('error', ctx.hbs)
	} finally {
		account.close() ; items.close()
	}
})

export default router
