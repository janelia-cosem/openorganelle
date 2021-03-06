import { createStyles, makeStyles, Theme, Typography } from "@material-ui/core";
import { Pagination } from "@material-ui/lab";
import React, { useContext, useState } from "react";
import { Dataset } from "../api/datasets";
import { AppContext } from "../context/AppContext";
import DatasetTile from "./DatasetTile";

const useStyles: any = makeStyles((theme: Theme) =>
    createStyles({
        root: {
            flexGrow: 1
        },
    })
);

export default function DatasetTileList() {
    const {appState, setAppState} = useContext(AppContext);
    const [currentPage, setCurrentPage] = useState(1);
    const datasetsPerPage = 10;
  
    const datasets: Map<string, Dataset> = appState.datasets;
  
    const rangeStart = (currentPage - 1) * datasetsPerPage;
    const rangeEnd = rangeStart + datasetsPerPage;
    const totalPages = Math.ceil(datasets.size / datasetsPerPage);
  
    const displayedDatasets = Array.from(datasets.keys())
      .slice(rangeStart, rangeEnd)
      .map((k, i) => (
        <DatasetTile
          datasetKey={k}
          key={`${k}_${rangeStart}_${i}`}
        />
      ));
  
    return (
      <div>
        <Typography variant="h5">
          Datasets {rangeStart + 1} to {Math.min(rangeEnd, datasets.size)} of{" "}
          {datasets.size}
        </Typography>
        {datasets.size > datasetsPerPage && (
          <Pagination
            count={totalPages}
            page={currentPage}
            onChange={(e, value) => setCurrentPage(value)}
          />
        )}
        {displayedDatasets}
        {datasets.size > datasetsPerPage && (
          <Pagination
            count={totalPages}
            page={currentPage}
            onChange={(e, value) => setCurrentPage(value)}
          />
        )}
      </div>
    );
  }