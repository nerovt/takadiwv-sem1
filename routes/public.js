
import Router from 'koa-router'

const router = new Router()

import Accounts from '../modules/accounts.js'
import Items from '../modules/items.js'
const dbName = 'website.db'

function modifyResults(results, ctx) {
	let items = []
	try {
		for(const i of results) {
			if(String(i.seller) !== String(ctx.session.username)) {
				items.push(i)
			}
		}
	} catch(err) {
		items = results
	}
	return items
}

/**
 * The secure home page.
 *
 * @name Home Page
 * @route {GET} /
 */
router.get('/', async ctx => {
	const account = await new Accounts(dbName)
	const items = await new Items(dbName)
	try {
		let results = await items.getDetails()
		results = modifyResults(results, ctx) //call function to modify
		ctx.hbs.record = [] ; ctx.hbs.record = results
		await ctx.render('index', ctx.hbs)
	} catch(err) {
		console.log(err.message)
		await ctx.render('error', ctx.hbs)
	} finally {
		account.close() ; items.close()
	}
})


/**
 * The user registration page.
 *
 * @name Register Page
 * @route {GET} /register
 */
router.get('/register', async ctx => await ctx.render('register'))

/**
 * The script to process new user registrations.
 *
 * @name Register Script
 * @route {POST} /register
 */
router.post('/register', async ctx => {
	const account = await new Accounts(dbName)
	try {
		// call the functions in the module
		await account.register(ctx.request.body.user, ctx.request.body.pass, ctx.request.body.email)
		ctx.redirect(`/login?msg=new user "${ctx.request.body.user}" added, you need to log in`)
	} catch(err) {
		console.log(err)
		ctx.hbs.msg = err.message
		ctx.hbs.body = ctx.request.body
		console.log(ctx.hbs)
		await ctx.render('register', ctx.hbs)
	} finally {
		await account.close()
	}
})

router.get('/login', async ctx => {
	console.log(ctx.hbs)
	await ctx.render('login', ctx.hbs)
})

router.post('/login', async ctx => {
	const account = await new Accounts(dbName)
	ctx.hbs.body = ctx.request.body
	try {
		const body = ctx.request.body
		await account.login(body.user, body.pass)
		ctx.session.authorised = true
		ctx.session.username = body.user
		const referrer = body.referrer || '/auc'
		return ctx.redirect(`${referrer}?msg=you are now logged in...`)
	} catch(err) {
		console.log(err)
		ctx.hbs.msg = err.message
		await ctx.render('login', ctx.hbs)
	} finally {
		await account.close()
	}
})

router.get('/logout', async ctx => {
	ctx.session.authorised = null
	ctx.session.username = null
	ctx.redirect('/?msg=you are now logged out')
})

export default router
