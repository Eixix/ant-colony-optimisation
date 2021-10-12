(ns ant-colony.antTSP
  (:require [ant-colony.antProperties :as Properties])
  (:require [ant-colony.util :as Util]))

(defn completeGraph [graph]
  "Function that completes the given graph. Uses the Properties/TSPFixCoefficient to determine how big the virtaul edges should be."
  (let [maxEntry (apply max (map (fn [x] (apply max x)) graph))
        ]
    (into [] (map-indexed (fn [i x] (into [] (map-indexed (fn [j y] (if (= i j)
                                                                      0
                                                                      (if (= y 0)
                                                                        (* @Properties/fixCoefficient maxEntry)
                                                                        y)
                                                                      )) x))) graph))
    )
  )

(defn getAttractivenessVector [edges position]
  "Returns a vector of the attractiveness for all points from the current point"
  (mapv (fn [x] (if (= x 0) 0 (/ 1 x))) ((completeGraph edges) position))
  )

(defn determineRelevance [ant index]
  "Determine whether a node with a given index is relevant to an ant or not in the sense of the TSP problem."
  (and
    (or (.contains (ant :alreadyVisited) index) (= (ant :position) index))
    (not= (count Properties/edges) (count (ant :alreadyVisited)))
    )
  )

(defn returnOverride [ant index]
  "Override the relevance once the ant traveled to all nodes and now can return to the ant hill."
  (if (and
        (= (+ (count (ant :alreadyVisited)) 1) (count Properties/edges))
        (= index @Properties/start)
        )
    1 ; this case can only be reached when all other paths are not relevant to the ant. Therefore, 1 is sufficient.
    0 ; all other cases are irrelevant ant in conclusion have an attractiveness of 0.
    )
  )

(defn generateSolution [ant edges pheromones]
  "Function that generates the next path for a given ant with given pheromones trails."
  (let [modifiedAttractiveness (into [] (map-indexed (fn [i x]
                                                       (if (determineRelevance ant i)
                                                         (returnOverride ant i) x)
                                                       )
                                                     (getAttractivenessVector edges (ant :position))
                                                     ))
        attractivenessSum (reduce + modifiedAttractiveness)
        modifiedPheromones (into [] (map-indexed (fn [i x]
                                                       (if (determineRelevance ant i)
                                                         0 x) ; no override needed because if the override happens only one path is available either way.
                                                       )
                                                     (pheromones (ant :position))
                                                     ))
        pheromoneSum (reduce + modifiedPheromones)
        probabilities (into [] (map-indexed
                                 (fn [i x]
                                   (if (= x 0) 0 (/ (+ x (modifiedPheromones i)) (+ attractivenessSum pheromoneSum)))
                                   )
                                 modifiedAttractiveness ))
        ]
   (Util/getPath 0 (probabilities 0) probabilities (rand))
   )
  )

(defn updateAnt [ant]
  "Function that decides whether a given ant changes its directive (aka reached its goal) or not."
  (if (and (= (count (ant :alreadyVisited)) (count Properties/edges)) (= (ant :position) @Properties/start))
    (assoc ant :shouldSprayPheromones true)
    ant
    )
  )

(defn prepare []
  "Function that prepares the problem and packages it so that the core can execute it."
  [@Properties/antList (completeGraph Properties/edges) @Properties/pheromones generateSolution updateAnt]
  )