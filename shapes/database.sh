for d in ./shapes/*/*.shp ; do
    [ -L "${d%/}" ] && continue
    table_name=$(basename "${d%.shp}")
    echo "Verificando tabela $table_name"
    if psql -U $POSTGRES_USER -d $POSTGRES_DB -c "SELECT 1 FROM $table_name LIMIT 1" | grep -q "1 row"; then
        echo "Tabela $table_name já criada"
    else
        echo "Tabela $table_name não criada. Criando e importando..."
        if $table_name == "logradouros"; then #TODO: Identificar projection
            shp2pgsql -I $d | psql -U $POSTGRES_USER -d $POSTGRES_DB
        else
            shp2pgsql -I -s 31983:4326 $d | psql -U $POSTGRES_USER -d $POSTGRES_DB
        fi
    fi
done

