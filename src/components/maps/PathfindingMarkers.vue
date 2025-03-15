<template>
  <l-layer-group>
    <l-marker
      v-for="node in Array.from(nodes)"
      :key="node"
      :lat-lng="[nodeData[node].lat, nodeData[node].lon]"
      :icon="nodeMarker"
      v-if="hasKey(nodeData, node)"
    />
  </l-layer-group>
</template>

<script>
import { LMarker, LLayerGroup } from "vue2-leaflet";
import { hasKey } from "@/utils";
import { nodeMarker } from "@/Icons";

export default {
  components: {
    LMarker,
    LLayerGroup,
  },
  props: {
    nodeData: Object, // Type: dataDict
    nodes: Set, // Type: Set<string>
  },
  data() {
    return {
      hasKey,
      nodeMarker,
    };
  },
};
</script>
