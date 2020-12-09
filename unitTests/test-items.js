
import test from 'ava'
import Items from '../modules/items.js'

test('REGISTER : error if blank item', async test => {
	test.plan(1)
	const items = await new Items()
	try {
		await items.register('', './images/fridge.png', 'sold', 'victor', '1234543')
		test.fail('error not thrown')
	} catch(err) {
		test.is(err.message, 'missing field', 'incorrect error message')
	} finally {
		items.close()
	}
})

test('REGISTER : error if blank image', async test => {
	test.plan(1)
	const items = await new Items()
	try {
		await items.register('fridge', '', 'sold', 'victor', '1234543')
		test.fail('error not thrown')
	} catch(err) {
		test.is(err.message, 'missing field', 'incorrect error message')
	} finally {
		items.close()
	}
})

test('REGISTER : error if blank status', async test => {
	test.plan(1)
	const items = await new Items()
	try {
		await items.register('fridge', './images/fridge.png', '', 'victor', '1234543')
		test.fail('error not thrown')
	} catch(err) {
		test.is(err.message, 'missing field', 'incorrect error message')
	} finally {
		items.close()
	}
})

test('REGISTER : error if blank seller', async test => {
	test.plan(1)
	const items = await new Items()
	try {
		await items.register('fridge', './images/fridge.png', 'sold', '', '1234543')
		test.fail('error not thrown')
	} catch(err) {
		test.is(err.message, 'missing field', 'incorrect error message')
	} finally {
		items.close()
	}
})

test('REGISTER : error if blank phoneNumber', async test => {
	test.plan(1)
	const items = await new Items()
	try {
		await items.register('fridge', './images/fridge.png', 'sold', 'victor', '')
		test.fail('error not thrown')
	} catch(err) {
		test.is(err.message, 'missing field', 'incorrect error message')
	} finally {
		items.close()
	}
})

test('REGISTER : success with valid details', async test => {
	test.plan(1)
	const items = await new Items()
	try {
		const result = await items.register('fridge', './images/fridge.png', 'sold', 'victor', '1234543')
		test.is(result, true)
	} catch(err) {
		test.fail('error thrown')
	} finally {
		items.close()
	}
})

test('GET DETAILS : success with valid details', async test => {
	test.plan(1)
	const items = await new Items()
	try {
		await items.register('fridge', './images/fridge.png', 'sold', 'victor', '1234543')
		const results = await items.getDetails()
		const object = {id: 1,item: 'fridge',
			image: './images/fridge.png',status: 'sold',
			seller: 'victor', phoneNumber: '1234543'}
		test.deepEqual(results[0], object)
	} catch(err) {
		test.fail('error thrown')
	} finally {
		items.close()
	}
})

test('DELETE ITEM : error if non-existant record', async test => {
	test.plan(1)
	const items = await new Items()
	try {
		await items.deleteItem(1)
        test.fail('error not thrown')
	} catch(err) {
		test.is(err.message, 'item record with "1" not found')
	} finally {
		items.close()
	}
})

test('DELETE ITEM : successful in deleting record', async test => {
	test.plan(1)
	const items = await new Items()
	try {
		await items.register('fridge', './images/fridge.png', 'sold', 'victor', '1234543')
		await items.deleteItem(1)
        const result = await items.getDetails()
        test.deepEqual(result, [])
	} catch(err) {
		test.fail('error thrown')
	} finally {
		items.close()
	}
})
