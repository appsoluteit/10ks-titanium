//
//  HealthKitProvider.swift
//  TiHealthkit
//
//  Created by Appcelerator Developer on 14/5/20.
//  Sample code used from https://www.raywenderlich.com/459-healthkit-tutorial-with-swift-getting-started.

import Foundation
import HealthKit

class HealthKitProvider {
    enum HealthkitSetupError : Error {
        case notAvailableOnDevice
        case dataTypeNotAvailable
    }
    
    func authorizeHealthKit(completion: @escaping (Bool, Error?) -> Swift.Void) {
        //1. Check to see if HealthKit Is Available on this device
        guard HKHealthStore.isHealthDataAvailable() else {
          completion(false, HealthkitSetupError.notAvailableOnDevice)
          return
        }
        
        //2. Prepare the data types that will interact with HealthKit
        guard let stepCount = HKObjectType.quantityType(forIdentifier: .stepCount) else {
            completion(false, HealthkitSetupError.dataTypeNotAvailable)
            return
        }
        
        //3. Prepare a list of types you want HealthKit to read and write
        let healthKitTypesToWrite: Set<HKSampleType> = []
        let healthKitTypesToRead: Set<HKObjectType> = [ stepCount ]
        
        
        //4. Request Authorization
        HKHealthStore().requestAuthorization(toShare: healthKitTypesToWrite,
                                             read: healthKitTypesToRead) { (success, error) in
          completion(success, error)
        }
    }
    
    func querySteps(start: Date, end: Date, completion: @escaping ([StepInfo], String) -> Swift.Void) {
        guard let stepsSampleType = HKSampleType.quantityType(forIdentifier: .stepCount) else {
            let err = "Steps Sample Type is no longer available in HealthKit"
            print(err)
            completion([], err)
            return
        }
        
        //1. Use HKQuery to load the most recent samples.
        let mostRecentPredicate = HKQuery.predicateForSamples(withStart: start,
                                                      end: end,
                                                      options: .strictEndDate)

        let sortDescriptor = NSSortDescriptor(key: HKSampleSortIdentifierStartDate,
                                      ascending: false)

        let sampleQuery = HKSampleQuery(sampleType: stepsSampleType,
                                predicate: mostRecentPredicate,
                                limit: HKObjectQueryNoLimit,
                                sortDescriptors: [sortDescriptor]) { (query, samples, error) in

            //2. Always dispatch to the main thread when complete.
            DispatchQueue.main.async {
                guard let samples = samples else {
                    completion([], error?.localizedDescription ?? "Unable to unwrap samples.")
                    return
                }
                
                let results = samples.map { (sample) -> StepInfo in
                    let quantitySample = sample as? HKQuantitySample
                    let steps = quantitySample?.quantity.doubleValue(for: HKUnit.count()) ?? -1
                    
                    return StepInfo(steps: Int(steps), eventDate: sample.startDate)
                }
                
                completion(results, "")
            }
        }

        HKHealthStore().execute(sampleQuery)
    }
}
