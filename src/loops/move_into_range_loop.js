/**
 * 
 * args:
 *  - interval: interval in milliseconds (default: 1000)
 */
function loader_loops_move_into_range(args)
{
    let interval = (args.interval ? args.interval : 1000);

    let id = setInterval(function(){   
        loot();

        if(character.rip || is_moving(character)) return;
    
        var target = get_targeted_monster();
        if(target) {
            if(!is_in_range(target)) {
                let travel = loader_base_calc_remaining_range_distance(character.x, character.y, target.x, target.y, character.range);
                
                move(
                    character.x + travel.xoff,
                    character.y + travel.yoff
                );
            }
        }
    }, interval);
    Loader.appendIntervalId(id);
}