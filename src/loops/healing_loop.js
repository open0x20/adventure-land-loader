/**
 * args:
 *  - interval: interval in milliseconds (default: 1000)
 */
function loader_loops_healing_loop(args)
{
    let interval = (args.interval ? args.interval : 1000);

    let id = setInterval(function() {
        
        if (character.mp < character.max_mp - 100) {
            if (!is_on_cooldown('regen_mp')) {
                use_skill('regen_mp');
                return;
            }
        } else if ((character.mp < character.max_mp - 400)) {
            use_skill('use_mp');
            return;
        }
        
        if (character.hp > character.max_hp - 450) {
            if (!is_on_cooldown('regen_hp')) {
                use_skill('regen_hp');
                return;
            }
        } else if ((character.hp < character.max_hp - 500)) {
            use_skill('use_hp');
            return;
        }

    }, interval);
    Loader.appendIntervalId(id);
}
