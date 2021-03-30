OFILE = loader-prod.js

loader-prod.js:
	mkdir -p ./dist
	echo "" > ./dist/$(OFILE)
	cat ./src/modal/modal.js >> ./dist/$(OFILE)
	cat ./src/modal/merchant.js >> ./dist/$(OFILE)
	cat ./src/base/attack_chain.js >> ./dist/$(OFILE)
	cat ./src/base/calc.js >> ./dist/$(OFILE)
	cat ./src/loops/healing_loop.js >> ./dist/$(OFILE)
	cat ./src/loops/targeting_loop.js >> ./dist/$(OFILE)
	cat ./src/loops/move_into_range_loop.js >> ./dist/$(OFILE)
	cat ./src/behaviour/auto_attack_farming.js >> ./dist/$(OFILE)
	cat ./src/behaviour/on_click_attack.js >> ./dist/$(OFILE)
	cat ./src/main.js >> ./dist/$(OFILE)