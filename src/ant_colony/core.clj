(ns ant-colony.core
  (:require [clojure.data.json :as JSON])
  (:require [ant-colony.antProperties :as Properties])
  (:require [ant-colony.util :as Util])
  (:require [ant-colony.antFood :as Problem])
  ;(:require [ant-colony.antTSP :as Problem])
  )

(def ants (atom []))
(def edges (atom []))
(def pheromones (atom []))
(def generateSolution (atom #()))
(def updateAnt (atom #()))
(def steps (atom 1))

(defn tickPheromones [pheromones]
  "Ticks all pheromone values down determined by the PheromoneCoefficient."
  (mapv (fn [x] (mapv (fn [y] (let [coefficient (* (- 1 @Properties/pheromoneCoefficient) y)]
                                (if (< coefficient @Properties/pheromoneBase) @Properties/pheromoneBase coefficient)
                                )) x)) pheromones)
  )

(defn pheromoneSprayer [nodes value pheromones]
  "Sprays a given pheromone value to the given path (determined by the node order)."
  (if (> (count nodes) 1)
    (recur (drop 1 nodes) value (into [] (map-indexed (fn [i x] (into [] (map-indexed (fn [j y] (if (or (and (not @Properties/directed) (or
                                                                                                                                          (and (= i (first nodes)) (= j (second nodes)))
                                                                                                                                          (and (= i (second nodes)) (= j (first nodes)))
                                                                                                                                          ))
                                                                                                        (and @Properties/directed (= i (first nodes)) (= j (second nodes))))
                                                                                                  (+ y value)
                                                                                                  y
                                                                                                  )) x))) pheromones))
           )
    (if @Properties/directed pheromones (Util/mirrorMatrix pheromones))
    )
  )

(defn pheromoneUpdate [antList pheromones]
  "Updates the pheromones by applying the defined parameters according to the ACO update rules."
  (if (empty? antList)
    pheromones
    (let [firstAnt (first antList)
          ]
      (if ((first antList) :shouldSprayPheromones)
        (recur (drop 1 antList) (pheromoneSprayer (conj (firstAnt :alreadyVisited) (firstAnt :position)) (/ @Properties/pheromoneConstant (firstAnt :tourLength)) pheromones))
        (recur (drop 1 antList) pheromones)
        )
      )
    )
  )

(defn generateJSONOutput []
  "Generates JSON out of the relevant atoms"
  (JSON/write-str {:step @steps :ants @ants :edges @edges :pheromones @pheromones :directed @Properties/directed})
  )

(defn step [antList edges pheromones function updater stop]
  "Main method of the algorithm - 1) all ants generate a step they want to do 2) the pheromones are updated"
  (let [newAntList (mapv updater (mapv
                                   (fn [v] (if (< (v :id) (* @steps (/ @Properties/antAmount @Properties/groupSpawn)))
                                             (let [newPath (function v edges pheromones)
                                                   ]
                                               {:id                    (v :id)
                                                :position              newPath
                                                :lastPosition          (v :position)
                                                :tourLength            (+ (v :tourLength) ((edges (v :position)) newPath))
                                                :alreadyVisited        (conj (v :alreadyVisited) (v :position))
                                                :shouldSprayPheromones (v :shouldSprayPheromones)
                                                :goal                  (v :goal)}
                                               )
                                             v
                                             ))
                                   antList))
        newPheromoneList (pheromoneUpdate newAntList (tickPheromones pheromones))
        ]
    (swap! steps inc)
    (println @steps)
    (if (and (not= stop -1) (< @steps stop))
      (recur (mapv (fn [x] (if (x :shouldSprayPheromones)
                             {:id                    (x :id)
                              :position              (x :position)
                              :lastPosition          (x :lastPosition)
                              :tourLength            0
                              :alreadyVisited        []
                              :shouldSprayPheromones false
                              :goal                  (if (= (x :position) @Properties/start)
                                                       @Properties/food
                                                       @Properties/start)}
                             x)) newAntList) edges newPheromoneList function updater stop)
      [(mapv (fn [x] (if (x :shouldSprayPheromones)
                       {:id                    (x :id)
                        :position              (x :position)
                        :lastPosition          (x :lastPosition)
                        :tourLength            0
                        :alreadyVisited        []
                        :shouldSprayPheromones false
                        :goal                  (if (= (x :position) @Properties/start)
                                                 @Properties/food
                                                 @Properties/start)}
                       x)) newAntList) edges newPheromoneList]
      )
    )
  )

(defn resetEntries
  "Resets all atoms"
  ([antsNew edgesNew pheromonesNew]
   (reset! ants antsNew)
   (reset! pheromones pheromonesNew)
   (reset! edges edgesNew))
  ([antsNew edgesNew pheromonesNew generateSolutionNew updateAntNew]
   (reset! ants antsNew)
   (reset! pheromones pheromonesNew)
   (reset! edges edgesNew)
   (reset! generateSolution generateSolutionNew)
   (reset! updateAnt updateAntNew))
  )

(defn initialize []
  "Sets initial values for atoms"
  (Properties/initialize)
  (let [[preparedAnts preparedEdges preparedPheromones preparedGenerateSolution preparedUpdateAnt] (Problem/prepare)
        edges (if @Properties/directed preparedEdges (Util/mirrorMatrix preparedEdges))
        ]
    (resetEntries preparedAnts edges preparedPheromones preparedGenerateSolution preparedUpdateAnt))
  (reset! steps 1)
  (generateJSONOutput)
  )

(defn apiEntry [stop]
  "Gets called by the API to start the calculation"
  (if (= @steps 1) (initialize))
  (let [[ants edges pheromones] (step @ants @edges @pheromones @generateSolution @updateAnt stop)
        ]
    (resetEntries ants edges pheromones))
  (generateJSONOutput)
  )