/**
 * Calculates the remaining x and y distance needed to be in the specified range. Currently
 * doesn't care about character height and width.
 * Returns the distance for each coordinate (can be negative).
 * 
 * @param {Number} cx Characters x coordinate
 * @param {Number} cy Characters y coordinate
 * @param {Number} tx Targets x coordinate
 * @param {Number} ty Targets y coordinate
 * @param {Number} range Characters range
 * @returns 
 */
function loader_base_calc_remaining_range_distance(cx, cy, tx, ty, range)
{
    let distance_full = Math.sqrt(Math.pow(cx - tx,2) + Math.pow(cy - ty,2))
    let distance_needed = distance_full - range;

    /*
    // Old ineffective calculation
    let alpha = Math.asin(abs((ty - cy)) / distance_full) * 180 / Math.PI;
    let xoff = (distance_needed * Math.sin((180 - 90 - alpha) * Math.PI / 180)) / Math.sin(90 * Math.PI / 180);
    let yoff = Math.sqrt(Math.pow(xoff, 2) - 2 * xoff * distance_needed * Math.cos(alpha * Math.PI / 180) + Math.pow(distance_needed, 2));
    */

    let xoff = (distance_needed / distance_full) * (tx - cx);
    let yoff = (distance_needed / distance_full) * (ty - cy);

    //if (tx < cx) xoff *= -1;
    //if (ty < cy) yoff *= -1;

    return {
        xoff:xoff,
        yoff:yoff
    };
}
