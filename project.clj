(defproject ant_colony "0.1.0"
  :description "A try to implement the ACO with LISP"
  :url "http://example.com/FIXME"
  :main api.main
  :license {:name "EPL-2.0 OR GPL-2.0-or-later WITH Classpath-exception-2.0"
            :url "https://www.eclipse.org/legal/epl-2.0/"}
  :dependencies [[org.clojure/clojure "1.10.1"]
                 [org.clojure/data.json "2.4.0"]
                 [compojure "1.6.1"]
                 [http-kit "2.3.0"]
                 [ring/ring-defaults "0.3.2"]]
  :aot :all
  :jvm-opts ["-Xmx8192M"])
