; Tutorial: https://medium.com/swlh/building-a-rest-api-in-clojure-3a1e1ae096e

(ns api.main (:gen-class)
  (:require [org.httpkit.server :as server]
            [compojure.core :refer :all]
            [compojure.route :as route]
            [ring.middleware.defaults :refer :all]
            [ring.util.response :refer [resource-response]]
            [ant-colony.core :as antCore]
            [ant-colony.antProperties :as properties]
            [clojure.data.json :as JSON]
            [clojure.edn :as edn])
  )

(defn step [req]
  {:status  200
   :headers {"Content-Type" "text/json" "Access-Control-Allow-Origin" "*"}
   :body    (antCore/apiEntry -1)})

(defn init [req]
  {:status  200
   :headers {"Content-Type" "text/json" "Access-Control-Allow-Origin" "*"}
   :body    (antCore/initialize)})

(defn getSettings [req]
  {:status  200
   :headers {"Content-Type" "text/json" "Access-Control-Allow-Origin" "*"}
   :body    (JSON/write-str {:start             @properties/start
                             :food              @properties/food
                             :antAmount         @properties/antAmount
                             :antGroups         @properties/groupSpawn
                             :pheromoneConstant @properties/pheromoneConstant
                             :pheromoneTicking  @properties/pheromoneCoefficient
                             :pheromoneBase     @properties/pheromoneBase
                             :tspFix            @properties/fixCoefficient
                             :directed          @properties/directed})})

(defn skip [req]
  {:status  200
   :headers {"Content-Type" "text/json" "Access-Control-Allow-Origin" "*"}
   :body    (antCore/apiEntry (edn/read-string ((req :params) :amount)))
   }
  )

(defn setSettings [req]
  {:status  200
   :headers {"Content-Type" "text/json" "Access-Control-Allow-Origin" "*"}
   :body    (JSON/write-str (properties/setSettings
                              (edn/read-string ((req :params) :start))
                              (edn/read-string ((req :params) :food))
                              (edn/read-string ((req :params) :amount))
                              (edn/read-string ((req :params) :phconstant))
                              (edn/read-string ((req :params) :phticking))
                              (edn/read-string ((req :params) :phbase))
                              (edn/read-string ((req :params) :tspfix))
                              (edn/read-string ((req :params) :groups))
                              (= ((req :params) :directed) "true")))}
  )

(defroutes appRoutes
           (GET "/step" [] step)
           (GET "/init" [] init)
           (GET "/getSettings" [] getSettings)
           (POST "/settings" [] setSettings)
           (POST "/skip" [] skip)
           (route/not-found "Error, page not found!")
           )

(defn -main
  "This is our main entry point"
  [& args]
  (let [port (Integer/parseInt (or (System/getenv "PORT") "3000"))]
    (server/run-server (wrap-defaults #'appRoutes api-defaults) {:port port})
    (println (str "Running webserver at http:/127.0.0.1:" port "/"))))