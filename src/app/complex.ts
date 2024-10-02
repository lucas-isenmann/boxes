

export function getElements(complex: Set<Set<number>>): Set<number> {
    const elements = new Set<number>();
    for (const facet of complex){
        for (const v of facet){
            if (elements.has(v) == false){
                elements.add(v)
            }
        }
    }
    return elements;
}

export function getNeighbors(complex: Set<Set<number>>): Map<number, Set<number>> {
    const neighbors = new Map();
    const elements = getElements(complex);
    
    for (const v of elements){
        neighbors.set(v, new Set());
    }
    for (const facet of complex){
        for (const u of facet){
            for (const v of facet){
                if (u != v){
                    neighbors.get(u).add(v);
                    neighbors.get(v).add(u);
                }
            }
        }
    }
    return neighbors;
}


function containsFace(set: Set<number>, facets: Set<Set<number>>): boolean {
    for (const facet of facets){
        let isIncluded = true;
        for (const x of set){
            if (facet.has(x) == false){
                isIncluded = false;
                break;
            }
        }
        if (isIncluded){
            return true;
        }
    }
    return false;
}

function auxHelly(v: number, clique: Set<number>, neighbors: Map<number, Set<number>>, facets: Set<Set<number>>): Set<number>{
    
    // Check if clique is in the complex
    if (containsFace(clique, facets) == false){
        const newClique = new Set(clique);
        return newClique;
    }

    for (const neighbor of neighbors.get(v)){
        if (clique.has(neighbor) == false){
            const n2 = neighbors.get(neighbor);
            let extensionOk = true;
            for (const x of clique){
                if (n2.has(x) == false){
                    extensionOk = false;
                    break;
                }
            }
            if (extensionOk){
                clique.add(neighbor);
                const r = auxHelly(v, clique, neighbors, facets);
                clique.delete(neighbor);
                if (r.size > 0){
                    return r;
                }
            }
        }
    }
    return new Set();
}

/**
 * 
 * @param complex 
 * 
 * @return a subset of non Helly stairs
 * @return an empty set if it is Helly
 */
export function isHelly(complex: Set<Set<number>>):  Set<number> {

    const elements = getElements(complex);
    const neighbors = getNeighbors(complex);
    for (const v of elements){
        let clique = new Set([v]);
        const r = auxHelly(v, clique, neighbors, complex);
        if (r.size > 0){
            return r;
        }
    }
    return new Set();

}