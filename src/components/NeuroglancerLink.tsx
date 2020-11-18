import { Button } from "@material-ui/core";
import React, { useContext } from "react";
import { Dataset, DatasetView, VolumeSource } from "../api/datasets";
import { AppContext } from "../context/AppContext";
import LaunchIcon from "@material-ui/icons/Launch";
import WarningIcon from "@material-ui/icons/Warning";

type NeuroglancerLinkProps = {
  dataset: Dataset;
  view: DatasetView;
  checkState: Map<string, boolean>;
  children: React.ReactNode;
};

export default function NeuroglancerLink({
  dataset,
  view,
  checkState,
  children
}: NeuroglancerLinkProps) {
  const [appState] = useContext(AppContext);
  const neuroglancerAddress = appState.neuroglancerAddress;
  const webGL2Enabled = appState.webGL2Enabled;
  // The local view contains the layer settings given by the currently selected view, plus any changes the user had made through the layer selection
  // checkboxes
  const local_view = { ...view };
  local_view.volumeKeys = [];
  dataset.volumes.forEach((value: VolumeSource, key: string) => {
    if (checkState.get(key)) {
      local_view.volumeKeys.push(key);
    }
  });

  let ngLink = "";
  const disabled = Boolean(local_view.volumeKeys.length === 0);

  if (!disabled) {
    ngLink = `${neuroglancerAddress}${dataset.makeNeuroglancerViewerState(
      local_view
    )}`;
  }

  if (children) {
    return React.Children.map(children, child => {
      const updatedProps = {
        disabled,
        href: ngLink,
        target: "_blank",
        rel: "noopener noreferrer"
      };
      if (React.isValidElement(child)) {
        return React.cloneElement(child, updatedProps);
      }
      return child;
    });
  } else {
    return (
      <>
        <Button
          variant="contained"
          disabled={disabled}
          color="primary"
          href={ngLink}
          target="_blank"
          rel="noopener noreferrer"
          endIcon={<LaunchIcon fontSize="small" />}
        >
          View
        </Button>
        {disabled ? " - select layers to view." : ""}
        {!webGL2Enabled && <WarningIcon />}
      </>
    );
  }
}
