/**
 * Selects a target closest to the player. 
 * 
 * args:
 *  - interval: interval in milliseconds (default: 1000)
 *  - onTargetFoundCallback: A callback that will be called when a new target has been found (with arguments: target.id)
 *  - targetingArgs: (see loader_base_target_nearest_monster)
 */
function loader_loops_targeting_loop(args)
{
    let interval = (args.interval ? args.interval : 1000);
    let targetingArgs = (args.targetingArgs ? args.targetingArgs : {});

    let id = setInterval(function() {
        // If we already have a selected target: skip this interval
        if (get_targeted_monster()) return;

        let target = loader_base_target_nearest_monster(targetingArgs);

        // If we found a suitable target
        if (target) {
            change_target(target);

            // If a callback has been supplied: call it
            if (args.onTargetFoundCallback) {
                setTimeout(function() {
                    args.onTargetFoundCallback(target.id)
                }, character.ping * 0.95);
                // The character target may not be updated immediately, that's why we wait a bit
            }
        }
    }, interval);
    Loader.appendIntervalId(id);
}
