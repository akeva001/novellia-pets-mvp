import React, { useState } from "react";
import {
  View,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Image,
} from "react-native";
import { Text, Icon } from "@rneui/themed";
import { MedicalRecord } from "../types";
import { customColors, typography } from "../theme";
import ImageView from "react-native-image-viewing";

interface RecordCardProps {
  record: MedicalRecord;
  onEdit: () => void;
}

export default function RecordCard({ record, onEdit }: RecordCardProps) {
  const [selectedImageIndex, setSelectedImageIndex] = useState<number>(-1);
  const recordImages =
    record.attachments?.filter((att) => att.type === "image") || [];

  return (
    <View style={styles.card}>
      <View style={styles.content}>
        <View style={styles.header}>
          <Text style={styles.title}>{record.name}</Text>
          <TouchableOpacity style={styles.editButton} onPress={onEdit}>
            <Icon
              name="edit"
              type="material"
              size={20}
              color={customColors.primary}
            />
          </TouchableOpacity>
        </View>
        <View style={styles.details}>
          <Text style={styles.text}>Type: {record.type}</Text>
          {"dateAdministered" in record && (
            <Text style={styles.text}>
              Date: {new Date(record.dateAdministered).toLocaleDateString()}
            </Text>
          )}
          {"reactions" in record && (
            <>
              <Text style={styles.text}>
                Reactions: {record.reactions.join(", ")}
              </Text>
              <Text style={styles.text}>Severity: {record.severity}</Text>
            </>
          )}
          {"dosage" in record && (
            <>
              <Text style={styles.text}>Dosage: {record.dosage}</Text>
              <Text style={styles.text}>
                Instructions: {record.instructions}
              </Text>
            </>
          )}

          {recordImages.length > 0 && (
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              style={styles.attachmentList}
            >
              {recordImages.map((attachment, index) => (
                <TouchableOpacity
                  key={attachment.id}
                  onPress={() => setSelectedImageIndex(index)}
                >
                  <Image
                    source={{ uri: attachment.uri }}
                    style={styles.attachmentImage}
                  />
                </TouchableOpacity>
              ))}
            </ScrollView>
          )}
        </View>
      </View>

      <ImageView
        images={recordImages.map((img) => ({ uri: img.uri }))}
        imageIndex={selectedImageIndex}
        visible={selectedImageIndex >= 0}
        onRequestClose={() => setSelectedImageIndex(-1)}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: customColors.inputBackground,
    borderRadius: 16,
    marginBottom: 16,
    marginHorizontal: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  content: {
    padding: 16,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },
  title: {
    ...typography.h3,
    color: customColors.primary,
    flex: 1,
  },
  editButton: {
    padding: 8,
    borderRadius: 8,
    backgroundColor: "rgba(209, 79, 48, 0.1)",
    width: 40,
    height: 40,
    alignItems: "center",
    justifyContent: "center",
  },
  details: {
    gap: 8,
  },
  text: {
    ...typography.body1,
  },
  attachmentList: {
    marginTop: 12,
  },
  attachmentImage: {
    width: 80,
    height: 80,
    borderRadius: 8,
    marginRight: 8,
  },
});
